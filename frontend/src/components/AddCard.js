import { useState } from "react";

export const AddCard = ({ addCard, categories, addCashbacks, toggleModal }) => {
    const [cardName, setCardName] = useState('');
    const [cbValues, setValues] = useState(() => 
        categories.reduce((acc, cat) => {
            acc[cat.id] = 0;
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        const value = e.target.value !== "" ? e.target.value : 0
        setValues(prev => ({
            ...prev, 
            [e.target.name]: value
        }))
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        const res = await addCard(cardName);
        await addCashbacks(res.id, null, cbValues);
        setCardName('');
        setValues({});
        toggleModal();
    }

    return (
        <div>
            <form onSubmit={handlesubmit}>
                <div>
                    <label>Name</label>
                    <input required type='text' value={cardName} placeholder="Card Name" 
                        onChange={(e) => setCardName(e.target.value)} />
                </div>
                    {categories.map(cat => (
                        <div>
                            <label key={cat.id} htmlFor={cat.id}>{cat.name}</label>
                            <input 
                                name={cat.id}
                                type="number"
                                placeholder="%"
                                value={cbValues[cat.id] || ""}
                                min={0} max={9}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                <button type='submit'>add card</button>
                <button onClick={toggleModal}>Cancel</button>
            </form>
        </div>
        
    );
}