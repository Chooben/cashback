import { useEffect, useState } from "react";
import { cardService } from "../services/cardService";

export const useCards = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        cardService.getCards()
            .then(res => setCards(res));
    }, []);

    const addCard = async (cardName) => {
        const res = await cardService.createCard(cardName);
        setCards(prev => 
            [...prev, res]
        );
        return res;
    };
    const updateCard = async (updatedCards) => {
        const rollback = cards;

        setCards(prev => 
            prev.map(card => 
                updatedCards[card.id] ? {...card, name: updatedCards[card.id]} : card
            )
        );
        const formatCards = Object.entries(updatedCards).map(
            ([id, name]) => ({ id: parseInt(id), name })
        );
        const result = await cardService.updateCards(formatCards);
        console.log("update status", result.status, "rollback", rollback)
        if (result.status !== 200) {
            setCards(rollback);
        }
    };
    const deleteCard = (id) => {
        setCards(prev => prev.filter(card => card.id !== id));
        cardService.deleteCard(id);
    };

    return {
        cards,
        setCards,
        addCard,
        updateCard,
        deleteCard,
    };
};