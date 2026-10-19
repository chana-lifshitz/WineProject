const wineRepository = require('../Repositories/wine.repository');

class Wine_service {
    constructor() { }

    async getAllWines() {
        return await wineRepository.getAllWines();
    }

    async getWineById(id) {
        return await wineRepository.getWineById(id);
    }
    
    async findWinesByCategory(category) {
        if (!category) {
            throw new Error("Category is required");
        }
        return await wineRepository.getWinesByCategory(category);
    }
    
    async addReview(id, review) {
        return await wineRepository.addReview(id, review);
    }

    async addWine(newWine) {
        return await wineRepository.addWine(newWine);
    }

    async removeWine(id) {
        const deleted = await wineRepository.deleteWineById(id);
        if (!deleted) {
            throw new Error("Wine not found");
        }
        return deleted;
    }

    async deleteReview(wineId, reviewIndex) {
    const updatedWine = await wineRepository.deleteReview(wineId, reviewIndex);
    if (!updatedWine) {
        throw new Error("Review not found or wine not found");
    }
    return updatedWine;
}
}

module.exports = new Wine_service();
