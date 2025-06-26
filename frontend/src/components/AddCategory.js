import { useState } from "react"

export const AddCategory = ({ addCat }) => {
    const [category, setCategory] = useState('');

    const handleCat = async (e) => {
        e.preventDefault();
        await addCat(category);
        setCategory('');
    }
    return (
        <form onSubmit={handleCat}>
            <div>
                <input required type='text' value={category} onChange={(e) => setCategory(e.target.value)} />
            <button type='submit'>add category</button>
            </div>            
        </form>
    );
}