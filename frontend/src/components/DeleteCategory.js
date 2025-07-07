export const DeleteCategory = ({ categories, deleteCategory, toggleModal }) => {
    const handleDelete = (id) => {
        deleteCategory(id);
        toggleModal();
    }
    return (
        <div>
            {categories.map(cat => 
                <div key={cat.id}>
                    <p>{cat.name}</p>
                    <button onClick={() => handleDelete(cat.id)}>X</button>
                </div>
            )}
        </div>
    );
}