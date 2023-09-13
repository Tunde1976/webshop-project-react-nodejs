export default function AdminSingleCategory (props) {
    return (
        <>
            <td className="table-cells">{props.category.id}</td>
            <td className="table-cells bold">{props.category.name}</td>
        </>
    )
}