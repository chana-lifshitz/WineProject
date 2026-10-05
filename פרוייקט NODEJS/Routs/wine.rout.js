const express = require('express');
const router = express.Router();
const wineService = require('../Servises/wine.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', 'data', 'wines.json');

// הגדרת אחסון התמונות לתיקיית images/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'image'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// API להעלאת תמונה
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename }); // רק שם הקובץ
});

// פונקציה ליצירת מזהה יין חדש (אופציונלי אם לא משתמשים ב-service)
async function generateNewId() {
  const rawDataWine = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const winesArray = rawDataWine.wines;
  const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
  return (maxId + 1).toString();
}

// הוספת יין חדש דרך רואטר (אם לא משתמשים בשירות)
router.post('/wines', async (req, res) => {
  try {
    const rawDataWine = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const winesArray = rawDataWine.wines;

    const newWine = {
      id: await generateNewId(),
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: req.body.image, // רק שם קובץ
      reviews: [],
      totalSold: 0
    };

    winesArray.push(newWine);
    fs.writeFileSync(dataPath, JSON.stringify(rawDataWine, null, 2), 'utf-8');

    res.json(newWine);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשמירת יין חדש' });
  }
});

// Get all wines
router.get('/', async (req, res) => {
    const wines = await wineService.getAllWines();
    res.json(wines);
});

// Get wines by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const wines = await wineService.findWinesByCategory(category);
    res.json(wines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get wine by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const wine = await wineService.getWineById(id);

    if (!wine) {
        return res.status(404).json({ message: 'Wine not found' });
    }
    res.json(wine);
});

// Add review to wine
router.post('/:id/review', async (req, res) => {
  try {
    const id = req.params.id;
    const reviewObj = req.body;  // לא רק review (string), אלא אובייקט

    if (!reviewObj || !reviewObj.comment) {
      return res.status(400).json({ message: 'Review object with comment is required' });
    }
    const updatedWine = await wineService.addReview(id, reviewObj);
    if (!updatedWine) {
      return res.status(404).json({ message: 'Wine not found' });
    }
    res.json(updatedWine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add wine through service (API)
router.post('/', async(req, res) => {
  try {
    const newWine = req.body;
    if (!newWine.name || !newWine.category || !newWine.price) {
      return res.status(400).json({ error: "Missing required fields: name, category or price" });
    }
    const addedWine = await wineService.addWine(newWine);
    res.status(201).json(addedWine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete wine by id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedWine = await wineService.removeWine(id);
    res.json({ message: "Wine deleted", wine: deletedWine });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id/review/:index', async (req, res) => {
  try {
    const id = req.params.id;
    const index = parseInt(req.params.index);

    if (isNaN(index)) {
      return res.status(400).json({ message: 'Invalid review index' });
    }

    const updatedWine = await wineService.deleteReview(id, index);
    res.json(updatedWine);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;
