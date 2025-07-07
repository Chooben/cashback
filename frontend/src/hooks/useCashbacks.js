import { useEffect, useMemo, useState } from "react"
import { cashbackService } from "../services/cashbackService";

export const useCashbacks = ({ cards, categories }) => {
    const [cashbacks, setCashbacks] = useState([]);

    useEffect(() => {
        cashbackService.getCashback()
            .then(res => setCashbacks(res));
        console.log(cashbackService.getCashback())
    }, []);

    const cbMap = useMemo(() => {
        const map = {};
        console.log("in cbmap: cards:", cards, "categories:", categories);
        if (!cards || !categories)  return map;
        
        cards.forEach(card =>
            categories.forEach(cat =>
                map[`${card.id}_${cat.id}`] = 0
            )
        );

        cashbacks.forEach(cb => 
            map[`${cb.cardId}_${cb.catId}`] = cb.percent || 0
        );

        return map;
    }, [cards, categories, cashbacks]);

    const addCashbacks = async (cardId, newCashbacks) => {
        const formatCb = Object.entries(newCashbacks).map(([catId, percent]) => (
            { 
                cardId: parseInt(cardId), 
                catId: parseInt(catId), 
                percent: parseFloat(percent),
            }
        ));
        const res = await cashbackService.createCashback(formatCb);
        console.log("addcashbacks result", res)
        setCashbacks(prev => [...prev, ...res]);
    };
    const updateCashbacks = (updatedCashbacks) => {
        setCashbacks(prev => 
            prev.map(cb => {
            const key = `${cb.cardId}_${cb.catId}`;
            return updatedCashbacks[key] !== undefined ?
                {...cb, percent: updatedCashbacks[key]} : cb
            }
        ));

        const formatCbs = Object.entries(updatedCashbacks).map(
            ([key, value]) => {
                const [cardId, catId] = key.split("_").map(Number);
                return { cardId, catId, percent: parseFloat(value) };
            }
        )
        cashbackService.updateCashback(formatCbs)
    };
    return {
        cashbacks,
        setCashbacks,
        cbMap,
        addCashbacks,
        updateCashbacks,
    }
}
