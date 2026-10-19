// const fs = require('fs');
// const path = require('path');
// const dataPath = path.join(__dirname, '..', 'wines_data.json');

// class Wine_repository {
//     constructor() { }

//     async getAllWines() {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         return rawData;
//     }

//     async getWineById(id) {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         // המרה ל-string להשוואה עקבית
//         const wine = rawData.wines.find(w => w.id.toString() === id.toString());
//         return wine || null;
//     }

//     async getWinesByCategory(category) {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         return rawData.wines.filter(wine => wine.category === category);
//     }

//     async addReview(id, reviewObj) {
//   const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//   const winesArray = rawData.wines;

//   const wine = winesArray.find(w => w.id.toString() === id.toString());
//   if (!wine) return null;

//   // הוסף את האובייקט במקום מחרוזת בלבד
//   wine.reviews.push(reviewObj);

//   fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

//   return wine;
// }


//     async generateNewId() {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         const winesArray = rawData.wines;
//         const maxId = winesArray.reduce((max, wine) => Math.max(max, parseInt(wine.id)), 0);
//         return (maxId + 1).toString();
//     }

//     async addWine(newWine) {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         const winesArray = rawData.wines;

//         newWine.id = await this.generateNewId();
//         newWine.reviews = [];
//         newWine.totalSold = 0;

//         winesArray.push(newWine);

//         fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

//         return newWine;
//     }

//     async deleteWineById(id) {
//         const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//         const winesArray = rawData.wines;

//         // המרה ל-string לשם השוואה עקבית
//         const index = winesArray.findIndex(w => w.id.toString() === id.toString());

//         if (index !== -1) {
//             const removed = winesArray.splice(index, 1)[0];
//             fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');
//             return removed;
//         }

//         return null;
//     }

//     async deleteReview(wineId, reviewIndex) {
//     const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//     const winesArray = rawData.wines;

//     const wine = winesArray.find(w => w.id.toString() === wineId.toString());
//     if (!wine || !wine.reviews || wine.reviews.length <= reviewIndex) {
//         return null;
//     }

//     wine.reviews.splice(reviewIndex, 1);

//     fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf-8');

//     return wine;
// }
// }

// module.exports = new Wine_repository();

const Wine = require('../Models/wine.model');

class Wine_repository {
    constructor() {}

    // חיפוש יין לפי ה-id הישן של הפרויקט
    async findWine(id) {
        const value = String(id);

        const conditions = [{ id: value }];

        // תומך גם בנתונים שבהם id נשמר כמספר
        if (/^\d+$/.test(value)) {
            conditions.push({ id: Number(value) });
        }

        return await Wine.findOne({ $or: conditions });
    }

    async getAllWines() {
        return await Wine.find({});
    }

    async getWineById(id) {
        return await this.findWine(id);
    }

    async getWinesByCategory(category) {
        return await Wine.find({ category });
    }

    async addReview(id, reviewObj) {
        const wine = await this.findWine(id);

        if (!wine) return null;

        if (!Array.isArray(wine.reviews)) {
            wine.reviews = [];
        }

        wine.reviews.push(reviewObj);
        await wine.save();

        return wine;
    }

    async generateNewId() {
        const wines = await Wine.find({}, { id: 1 }).lean();

        const maxId = wines.reduce((max, wine) => {
            const numericId = Number(wine.id);
            return Number.isFinite(numericId)
                ? Math.max(max, numericId)
                : max;
        }, 0);

        return String(maxId + 1);
    }

    async addWine(newWine) {
        const id = await this.generateNewId();

        const wine = new Wine({
            ...newWine,
            id,
            reviews: [],
            totalSold: 0
        });

        return await wine.save();
    }

    async deleteWineById(id) {
        return await this.findWine(id).then(async wine => {
            if (!wine) return null;

            await wine.deleteOne();
            return wine;
        });
    }

    async deleteReview(wineId, reviewIndex) {
        const wine = await this.findWine(wineId);

        if (
            !wine ||
            !Array.isArray(wine.reviews) ||
            reviewIndex < 0 ||
            reviewIndex >= wine.reviews.length
        ) {
            return null;
        }

        wine.reviews.splice(reviewIndex, 1);
        await wine.save();

        return wine;
    }
}

module.exports = new Wine_repository();
