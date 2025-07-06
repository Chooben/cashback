import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/card",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function getCards () {
    try {
        const result = await api.get('');
        return result.data || [];
    } catch (err) {
        console.error("Could not GET /cards", err);
        return [];
    }
};

async function createCard (cardName) {
    try {
        const result = await api.post('', cardName);
        return result.data || {};
    } catch (err) {
        console.error("Could not POST /card", err);
        return {};
    }
};

async function updateCards (cardValues) {
    try {
        const result = await api.put('', cardValues);
        return result.data || [];
    } catch (err) {
        console.error("Failed to UPDATE /card", err);
        return [];
    }
};
async function deleteCard (cardId) {
    try {
        const result = await api.delete(`/${cardId}`);
        console.log(`Deleting: ${api.defaults.baseURL}/${cardId}`);

        return result.data || {};
    } catch (err) {
        console.error("Failed to DELETE /card", err);
        return {};
    }
};

export const cardService = {
    getCards,
    createCard,
    updateCards,
    deleteCard,
}