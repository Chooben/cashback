import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/cashback",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

let result;
async function getCashback () {
    try {
        result = await api.get('');
        return result.data || [];
    } catch (err) {
        console.error("", err);
        return [];
    }
};

async function createCashback (newCashback) {
    try {
        result = await api.post('', newCashback);
        return result.data || [];
    } catch (err) {
        console.error("", err);
        return [];
    }
};

async function updateCashback (cashbackValues) {
    try {
        result =await api.put('', cashbackValues);
        return result.data
    } catch (err) {
        console.error("", err);
        return [];
    }
};

export const cashbackService = {
    getCashback,
    createCashback,
    updateCashback,
}