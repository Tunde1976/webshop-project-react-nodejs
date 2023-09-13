
export default function AdminSingleOrderDetails(props) {
    return (
        <>
            <tr key={props.product.product_id}>
                <td className="table-cells">{props.product.product_id}</td>
                <td className="table-cells">{props.product.title}</td>
                <td className="table-cells">{props.product.price} Ft</td>
                <td className="table-cells">{props.product.quantity} db</td>
            </tr>
        </>
    )
}