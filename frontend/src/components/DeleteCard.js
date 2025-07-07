export const DeleteCard = ({ cards, deleteCard, toggleModal }) => {
    const handleDelete = (id) => {
        deleteCard(id);
        toggleModal();
    }

    return (
        <div>
            {cards.map(card => 
                <div key={card.id}>
                    <p>{card.name}</p><button onClick={() => handleDelete(card.id)}>X</button>
                </div>
            )}
        </div>
    );
}