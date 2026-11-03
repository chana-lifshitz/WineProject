import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router';
import { useWineContext } from '../../context/WineContext';
import './VirtualSommelier.scss';
interface Wine {
    _id?: string;
    id: string;
    name: string;
    category: string;
    description?: string;
    price: number;
    image?: string;
}
interface Message {
    sender: 'user' | 'ai';
    text: string;
    wines?: Wine[];
}
interface VirtualSommelierProps {
    onAddToCart?: (wine: Wine) => void;
}
const WELCOME_MESSAGE: Message = {
    sender: 'ai',
    text: 'שלום! אני יועץ היין החכם שלך 🍷. מחפשים יין לארוחה, מתנה או סתם ערב טוב? ספרו לי מה אתם מחפשים ואשמח לעזור!'
};
export default function VirtualSommelier({ onAddToCart }: VirtualSommelierProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [inputPrompt, setInputPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { setRecommendedWines } = useWineContext();
    const navigate = useNavigate();
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    const startNewConversation = () => {
        setMessages([WELCOME_MESSAGE]);
        setInputPrompt('');
    };
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputPrompt.trim() || isLoading) return;
        const userMsg = inputPrompt;
        setInputPrompt('');
        
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/sommelier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userMsg,
                    // ללא הודעת הפתיחה, כדי שהיועץ יבין שאלות המשך
                    history: messages.slice(1).map(m => ({ sender: m.sender, text: m.text }))
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [
                    ...prev, 
                    { sender: 'ai', text: data.reply, wines: data.wines }
                ]);
            } else {
                setMessages(prev => [
                    ...prev, 
                    { sender: 'ai', text: 'אופס, אירעה שגיאה בקבלת ההמלצה. נסו שוב.' }
                ]);
            }
        } catch (error) {
            console.error('Error connecting to sommelier:', error);
            setMessages(prev => [
                ...prev, 
                { sender: 'ai', text: 'לא מצליח להתחבר לשרת כרגע. ודאו שהשרת פתוח.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="sommelier-widget-container">
            {!isOpen && (
                <button className="sommelier-fab" onClick={() => setIsOpen(true)}>
                    🍷 יועץ יין חכם
                </button>
            )}
            {isOpen && (
                <div className="sommelier-chat-window">
                    <div className="sommelier-header">
                        <h3>יועץ יין חכם 🍇</h3>
                        <div className="header-actions">
                            <button
                                className="new-chat-btn"
                                onClick={startNewConversation}
                                disabled={isLoading || messages.length <= 1}
                                title="מחיקת השיחה והתחלת שיחה חדשה"
                            >
                                שיחה חדשה ↺
                            </button>
                            <button className="close-btn" onClick={() => setIsOpen(false)} title="סגירת החלון">✕</button>
                        </div>
                    </div>
                    <div className="sommelier-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <div className="message-text">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                                {msg.wines && msg.wines.length > 0 && (
                                    <div className="sommelier-wine-cards">
                                        {msg.wines.map(wine => (
                                            <div key={wine._id || wine.id} className="mini-wine-card">
                                                {wine.image && (
                                                    <img 
                                                        src={wine.image.startsWith('http') ? wine.image : `http://localhost:5000/image/${wine.image}`} 
                                                        alt={wine.name} 
                                                    />
                                                )}
                                                <div className="wine-card-info">
                                                    <h4>{wine.name}</h4>
                                                    <p className="wine-price">₪{wine.price}</p>
                                                    {onAddToCart && (
                                                        <button 
                                                            className="add-to-cart-btn"
                                                            onClick={() => onAddToCart(wine)}
                                                        >
                                                            הוסף לסל 🛒
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {/* כפתור סינון שיופיע אך ורק כשיש יינות ספציפיים שהומלצו */}
                                        <button 
                                            className="filter-shop-btn"
                                            onClick={() => {
                                                setRecommendedWines(msg.wines!);
                                                navigate('/Home/Wines');
                                            }}
                                            style={{ 
                                                width: '100%', 
                                                marginTop: '12px', 
                                                padding: '10px', 
                                                background: '#722f37', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '6px', 
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            סנן את החנות לפי היינות האלו 🔍
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message ai loading">
                                <div className="message-text">היועץ הוירטואלי חושב ובוחר את היינות המתאימים... ⏳</div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form className="sommelier-input-form" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="שאלו את היועץ (למשל: יין אדום לבשר...)" 
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                        />
                        <button type="submit">שלח</button>
                    </form>
                </div>
            )}
        </div>
    );
}