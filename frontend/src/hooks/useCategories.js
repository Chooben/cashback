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
    const udpateCategory = async (updatedCats) => {
        const rollback = categories;
        setCategories(prev => 
            prev.map(cat => 
                updatedCats[cat.id] ? {...cat, name: updatedCats[cat.id]} : cat
            )
        );
        const formatCats = Object.entries(updatedCats)
            .map(([id, name]) => ({ id: parseInt(id), name }));
        const result = await categoryService.udpateCategory(formatCats);
        if (result.status !== 200) {
            setCategories(rollback);
        }
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