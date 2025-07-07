import { useEffect, useMemo, useState } from "react"
import { cashbackService } from "../services/cashbackService";

export const useCashbacks = ({ cards, categories }) => {
    const [cashbacks, setCashbacks] = useState([]);

    useEffect(() => {
        cashbackService.getCashback()
            .then(res => setCashbacks(res));
    }, []);

    const cbMap = useMemo(() => {
        const map = {};
        cashbacks.forEach(cb => 
            map[`${cb.cardId}_${cb.catId}`] = cb.percent || 0
        );
        return map;
    }, [cashbacks]);

    const addCashbacks = async (cardId, catId, newCashbacks) => {
        const newCbs = [];
        if (cardId) {
            Object.entries(newCashbacks).map(([catId, percent]) => 
                newCbs.push({ 
                    cardId: parseInt(cardId), 
                    catId: parseInt(catId), 
                    percent: parseFloat(percent),
                })
            );
            
            
        } else if (catId) {
            if (cards.length > 0) {
                cards.forEach(card => newCbs.push({ cardId: card.id, catId, percent: 0}));
            }
        }
        const res = await cashbackService.createCashback(newCbs);
        setCashbacks(prev => [...prev, ...res]);
        console.log("addcashbacks result", res)
        
    };
    const updateCashbacks = (updatedCashbacks) => {
        console.log("udpate cashbacks input", updatedCashbacks);
        setCashbacks(prev => 
            prev.map(cb => 
                updatedCashbacks[`${cb.cardId}_${cb.catId}`] !== undefined ? 
                    {
                        ...cb, 
                        percent: parseFloat(updatedCashbacks[`${cb.cardId}_${cb.catId}`])
                    } : cb
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
