import { useEffect, useState } from "react";
import {TableHeadDisplay} from './TableHeadDisplay.js';
import { TableHeadEdit } from "./TableHeadEdit.js";

export const TableHead = ({ categories, isEditing, saveCats}) => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues(categories)
  }, [categories]);

  const handleChange = (e, id) => {
    const newName = e.target.value;
    setValues(prev =>
      prev.map(value => 
        value.id === id ?
          {...value, name: newName} : value
      ))}

  const handleSubmit = () => {
    console.log("submitted cats", values)
    saveCats(values);
  }
  
  console.log(values);
  return (
      <thead>
        <tr>
          <th>Credit Card</th>

          {values.map(cat => 
              isEditing ? <TableHeadEdit cat={cat} handleChange={handleChange} /> : <TableHeadDisplay cat={cat} />
            )}

            <th key={values.length+1}>
              <button onClick={handleSubmit}>save cats</button>
            </th>
        </tr>
    </thead>
  )
}