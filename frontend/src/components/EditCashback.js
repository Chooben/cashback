import { useState } from "react"

export const EditCashback = ({ cardId, cashback, categories, updateCash, cardName }) => {
    console.log("editcashback name:" ,cardName)
    const [values, setValues] = useState(cashback);

    const handleChange = (e) => {
        setValues(prev => ({
            ...prev, 
            [e.target.name]: parseFloat(e.target.value) || 0
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCash(cardId, values);
    }

    console.log("Updated card:", { cardId, values })
    return (
        <div>
            <h1>{cardName}</h1>
            <form onSubmit={handleSubmit}>
            {categories.map(cat => (
                <div key={cat.id}>
                    <label htmlFor={cat.id}>{cat.name}</label>
                    <input 
                        name={cat.id} 
                        type="number"
                        value={values[cat.id] || ""}
                        min={0} max={9}
                        onChange={handleChange}
                    />
                </div>
            ))}
            <button type="submit">Save</button>
        </form>
        </div>
        
    )
}