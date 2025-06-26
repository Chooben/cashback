import React from "react";

export const TableHead = ({ categories }) => {
    return (
        <thead>
          <tr>
            <th>Credit Card</th>
            {categories.map((cat) => (
              <th key={cat.id}>{cat.name}</th>
            ))}
          </tr>
      </thead>
    )
}