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
        return res.id;
    };
    const updateCard = (updatedCards) => {
        setCards(prev => 
            prev.map(card => 
                updatedCards[card.id] ? {...card, name: updatedCards[card.id]} : card
            )
        );
        const formatCards = Object.entries(updatedCards).map(
            ([id, name]) => ({ id: parseInt(id), name })
        );
        cardService.updateCards(formatCards);
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