import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/category",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function getCategory () {
    try {
        const result = await api.get('');
        return result.data || [];
    } catch (err) {
        console.log("Failed to GET /category", err);
        return [];
    }
};

async function addCategory (name) {
    try {
        const result = await api.post('', { name });
        return result.data || {};
    } catch (err) {
        console.err("Failed to POST /category", err);
        return {};
    }
};

async function udpateCategory (catValues) {
    try {
        const result = await api.put('', catValues);
        return result.data || [];
    } catch (err) {
        console.log("Failed to PUT /category", err);
        return [];
    }
};
async function deleteCategory (id) {
    try {
        const result = await api.delete(`/${id}`);
    } catch (err) {
        console.error("Failed to delete /category", err);
    }
}

export const categoryService = {
    getCategory,
    addCategory,
    udpateCategory,
    deleteCategory,
}