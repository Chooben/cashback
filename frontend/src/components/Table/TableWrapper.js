import { useState, useEffect, useRef } from "react";

export const TableWrapper = ({ cards, categories, cbMap, isEditing, handleEdit }) => {
    const [editingState, setEditingState] = useState();
    const [editCards, setEditCards] = useState([]);
    const [editCats, setEditCats] = useState([]);
    const [editCbs, setEditCbs] = useState({});
    const updatedCards = useRef({});
    const updatedCats = useRef({});
    const updatedCbs = useRef({});

    useEffect(() => {
        setEditCards(cards);
        setEditCats(categories);
        setEditCbs(cbMap);
    }, [cards, categories, cbMap]);

    const getCb = (cardId, catId) => {
        const key = `${cardId}_${catId}`;
        const value = parseFloat(editCbs[key]);
        return {key, value}
    };

    const handleChange = (e, type, cardId, catId) => {
        const value = e.target.value;
        if (type === "card") {
            setEditCards(prev =>
                prev.map(card => card.id === cardId ?
                    {...card, name: value} : card
            ));
            updatedCards.current[cardId] = value;
        } else if (type === "cat") {
            setEditCats(prev => 
                prev.map(cat => cat.id === catId ?
                    {...cat, name: value} : cat
            ));
            updatedCats.current[catId] = value;
        } else if (type === "cb") {
            const cb = getCb(cardId, catId);
            setEditCbs(prev => ({
                ...prev, 
                [cb.key]: parseFloat(value) || 0
            }));
            console.log("cb editing value", value);
            console.log("current cb key", cb.key)
            updatedCbs.current[cb.key] = parseFloat(value) || 0;
            console.log("updatedCbs being returned", updatedCbs);
        } else {
            console.log("Invalid handle change type");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleEdit(updatedCards.current, updatedCats.current, updatedCbs.current);
        updatedCards.current = {};
        updatedCats.current = {};
        updatedCbs.current = {};
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Credit Card</td>
                        {editCats.map(cat => 
                            <td key={cat.id}>
                                {isEditing ? (
                                    <input 
                                    type="text"
                                    required 
                                    value={cat.name} 
                                    onChange={(e) => handleChange(e, "cat", null, cat.id)} />
                                ) : cat.name}
                            </td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {editCards.map(card => (
                        <tr key={card.id}>
                            <td>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        required
                                        value={card.name} onChange={(e) => handleChange(e, "card", card.id, null)}
                                    />
                                ) : card.name}
                            </td>
                            {editCats.map(cat => {
                                const cb = getCb(card.id, cat.id);

                                return (
                                    <td key={cat.id}>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={cb.value || ""}
                                                min={0} max={9}
                                                onChange={(e) => handleChange(e, "cb", card.id, cat.id)}
                                            />
                                        ) : parseFloat(cb.value) > 0 ? `${cb.value}%` : "-"}
                                    </td>
                                )
                            })}                        
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditing && (
                <div>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={() => handleEdit({}, {}, {})}>Cancel</button>
                </div>
            )}
        </div>
    );
}