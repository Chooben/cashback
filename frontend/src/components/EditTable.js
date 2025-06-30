import { useState } from "react"

export const EditTable = ({ cards, categories, cashbacks }) => {

    const handleSubmit = (e) => {

    }
    return (
        <form onSubmit={handleSubmit}>
            <table>
                <thead>
                    <tr>
                        <td>Credit Card</td>
                        {categories.map(cat => (
                            <td>
                                <input>{cat.name}</input>
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cards.map(card => (
                        <tr >
                            <td>{card.name}</td>
                            {categories.map(cat => (
                                <td>
                                    <input value={cashbacks[card.id][cat.id]}>{cashbacks[card.id][cat.id]}</input>
                                </td>
                            ))}
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </form>
        
    )
}