import React from "react";

export const TableBody = ({ editCash, cards, categories, cashbacks, isEditing }) => {
    return (
        <tbody>
            {cards.map(card => (
                <tr key={card.id}>
                    <td className="card-name">{card.name}</td>
                    {categories.map(cat => (
                        <td key={cat.id}>
                            {cashbacks[card.id]?.[cat.id] !== 0 ? 
                                `${cashbacks[card.id][cat.id]}%` : '-'}
                        </td>
                    ))}
                    {isEditing ? (<td>
                        <button onClick={() => {editCash(card.id)}}>+</button>
                    </td> ) : (<td></td>)}                     
                </tr>
            ))}
      </tbody>
    )
}