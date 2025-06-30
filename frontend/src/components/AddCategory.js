import { useState } from "react"

export const AddCategory = ({ addCat, categories, toggleModal }) => {
    const [category, setCategory] = useState('');

    const handleCat = async (e) => {
        e.preventDefault();
        await addCat(category);
        setCategory('');
    }
    return (
        <div>
            <form onSubmit={handleCat}>
                    <input required type='text' value={category} onChange={(e) => setCategory(e.target.value)} />
                    <button type='submit'>add category</button>  
                    <button onClick={toggleModal}>Cancel</button>         
            </form>
            
            <ul>
                {categories.map((cat) => (
                    <li key={cat.id}>{cat.name}</li>
                ))}
            </ul>

        </div>
        
    );
}