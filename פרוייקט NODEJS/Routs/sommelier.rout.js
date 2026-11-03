const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const wineService = require('../Servises/wine.service');

// אתחול ה-SDK של Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_HISTORY_MESSAGES = 10;
const MAX_RECOMMENDED_WINES = 4;

const SYSTEM_PROMPT = `אתה יועץ יין מקצועי, חם וענייני בחנות היינות של יקב פסגות.
תפקידך לעזור ללקוח לבחור יין מתוך המלאי של החנות בלבד.

כללים:
1. בכל תשובה המלץ על 1 עד ${MAX_RECOMMENDED_WINES} יינות מתוך רשימת המלאי שתקבל, שמתאימים ככל האפשר לבקשה (סוג, מחיר, אירוע, התאמה לאוכל, טעם).
2. לעולם אל תמציא יינות שאינם ברשימה, ואל תמליץ על יינות של יקבים אחרים.
3. אמור שאין יין מתאים רק אם באמת אין ברשימה אף יין מהסוג שהלקוח ביקש. גם אז - הצע את החלופה הקרובה ביותר מהמלאי.
4. אם הבקשה כללית (למשל "יין אדום"), בחר את היינות המתאימים ביותר מאותה קטגוריה והסבר בקצרה למה.
5. אם הלקוח רק מברך, מודה או שואל שאלה שאינה על בחירת יין - ענה בקצרה ובחום, ואל תמליץ על יינות (רשימה ריקה).
6. התייחס להקשר השיחה הקודמת (למשל "ומשהו יותר זול?").
7. כתוב בעברית, קצר ולעניין: משפט פתיחה אחד, ואז רשימת Markdown שבה כל יין בשורה נפרדת שמתחילה ב-"- ", עם שמו המדויק מודגש, המחיר ומשפט קצר למה הוא מתאים. ללא חתימות.

החזר אך ורק JSON תקין במבנה:
{"reply": "<התשובה ללקוח בפורמט Markdown>", "wineIds": ["<id>", ...]}
כאשר wineIds הם מזהי היינות מהרשימה שעליהם המלצת, לפי סדר ההמלצה.`;

function buildCatalog(wines) {
    return wines
        .map(w => `id:${w.id} | ${w.name} | ${w.category} | ₪${w.price}${w.description ? ` | ${w.description}` : ''}`)
        .join('\n');
}

function parseModelJson(content) {
    const clean = (content || '').replace(/```json/g, '').replace(/```/g, '').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : clean);
}

async function askSommelier(req, res) {
    try {
        const { prompt, history } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: 'יש לספק הודעה ליועץ' });
        }

        const rawWines = await wineService.getAllWines();
        const allWines = Array.isArray(rawWines) ? rawWines : (rawWines.wines || []);

        // היסטוריית השיחה מהלקוח, כדי שהיועץ יבין שאלות המשך
        const previousMessages = (Array.isArray(history) ? history : [])
            .filter(m => m && typeof m.text === 'string' && (m.sender === 'user' || m.sender === 'ai'))
            .slice(-MAX_HISTORY_MESSAGES)
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

        const completion = await groq.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            temperature: 0.4,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'system', content: `רשימת היינות במלאי:\n${buildCatalog(allWines)}` },
                ...previousMessages,
                { role: 'user', content: prompt }
            ]
        });

        const content = completion.choices[0]?.message?.content;

        let reply;
        let wineIds = [];
        try {
            const parsed = parseModelJson(content);
            reply = parsed.reply;
            wineIds = Array.isArray(parsed.wineIds) ? parsed.wineIds.map(String) : [];
        } catch (parseError) {
            console.error('Failed to parse sommelier response:', content);
            reply = content;
        }

        // מחזירים רק יינות שבאמת קיימים במלאי, לפי סדר ההמלצה
        const winesById = new Map(allWines.map(w => [String(w.id), w]));
        const recommendedWines = [...new Set(wineIds)]
            .map(id => winesById.get(id))
            .filter(Boolean)
            .slice(0, MAX_RECOMMENDED_WINES);

        res.json({
            reply: reply || 'מצטער, לא הצלחתי לנסח המלצה. אפשר לנסות לנסח את הבקשה אחרת?',
            wines: recommendedWines
        });

    } catch (error) {
        console.error('Error in virtual sommelier:', error);
        res.status(500).json({ error: 'אירעה שגיאה בעיבוד בקשת היועץ' });
    }
}

router.post('/', askSommelier);

module.exports = router;
