import { useState } from "react";

export const AddCard = ({ addCard, categories }) => {
    const [values, setValues] = useState([]);
    const [cardName, setCardName] = useState('');

    const handleChange = (e) => {
        setValues(prev => ({
            ...prev, 
            [e.target.name]: e.target.value || 0
        }))
    }

    const handlesubmit = async (e) => {
    e.preventDefault();
    await addCard(cardName, values);
    console.log(values)
    setCardName('');
    setValues({})
  }

    return (
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
                            value={values[cat.id] || ""}
                            min={0} max={9}
                            onChange={handleChange}
                        />
                    </div>
                ))}
            <button type='submit'>add card</button>
        </form>
    );
}