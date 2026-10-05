const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'wines_data.json');

class Wine_repository {
    constructor() { }

    async getAllWines() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData;
    }

    async getWineById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        // המרה ל-string להשוואה עקבית
        const wine = rawData.wines.find(w => w.id.toString() === id.toString());
        return wine || null;
    }

    async getWinesByCategory(category) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        return rawData.wines.filter(wine => wine.category === category);
    }

    async addReview(id, reviewObj) {
  const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const winesArray = rawData.wines;

  const wine = winesArray.find(w => w.id.toString() === id.toString());
  if (!wine) return null;

  // הוסף את האובייקט במקום מחרוזת בלבד
  wine.reviews.push(reviewObj);

  fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

  return wine;
}


    async generateNewId() {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const winesArray = rawData.wines;
        const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
        return (maxId + 1).toString();
    }

    async addWine(newWine) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const winesArray = rawData.wines;

        newWine.id = await this.generateNewId();
        newWine.reviews = [];
        newWine.totalSold = 0;

        winesArray.push(newWine);

        fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

        return newWine;
    }

    async deleteWineById(id) {
        const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const winesArray = rawData.wines;

        // המרה ל-string לשם השוואה עקבית
        const index = winesArray.findIndex(w => w.id.toString() === id.toString());

        if (index !== -1) {
            const removed = winesArray.splice(index, 1)[0];
            fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');
            return removed;
        }

        return null;
    }

    async deleteReview(wineId, reviewIndex) {
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const winesArray = rawData.wines;

    const wine = winesArray.find(w => w.id.toString() === wineId.toString());
    if (!wine || !wine.reviews || wine.reviews.length <= reviewIndex) {
        return null;
    }

    wine.reviews.splice(reviewIndex, 1);

    fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

    return wine;
}
}

module.exports = new Wine_repository();
