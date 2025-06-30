export const TableHeadDisplay = ({ cat }) => {
    return (
        <th key={cat.id}>{cat.name}</th>
    );
}