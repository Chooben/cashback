export const DeleteCard = ({ cards, deleteCard }) => {
    return (
        <div>
            {cards.map(card => 
                <div key={card.id}>
                    <p>{card.name}</p><button onClick={() => deleteCard(card.id)}>X</button>
                </div>
            )}
        </div>
    );
}