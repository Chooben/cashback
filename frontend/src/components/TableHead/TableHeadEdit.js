export const TableHeadEdit = ({ cat, handleChange }) => {
    return (
        <th key={cat.id}>
            <input value={cat.name} onChange={(e) => handleChange(e, cat.id)} />
        </th>
    );
}