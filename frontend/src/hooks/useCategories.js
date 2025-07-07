import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryService.getCategory()
            .then(res => setCategories(res));
    }, []);

    const addCategory = async (name) => {
        const formatName = name.toLowerCase().trim();
        if (categories.some(cat => cat.name.toLowerCase() === formatName))
            return;

        const res = await categoryService.addCategory(formatName);
        setCategories(prev => [...prev, res]);
        return res;
    };
    const udpateCategory = (updatedCats) => {
        setCategories(prev => 
            prev.map(cat => 
                updatedCats[cat.id] ? {...cat, name: updatedCats[cat.id]} : cat
            )
        );
        const formatCats = Object.entries(updatedCats)
            .map(([id, name]) => ({ id: parseInt(id), name }));
        categoryService.udpateCategory(formatCats);
    };
    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
        categoryService.deleteCategory(id);
    };

    return {
        categories,
        setCategories,
        addCategory,
        udpateCategory,
        deleteCategory,
    }
}