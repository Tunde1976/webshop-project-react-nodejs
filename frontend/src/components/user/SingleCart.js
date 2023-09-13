export default function SingleCart (props) {
    return (
        <>
            <td className="table-cells">{props.cartItem.title}</td>
            <td className="table-cells">{props.cartItem.quantity}</td>
            <td className="table-cells">{props.cartItem.price} Ft</td>
            <td className="table-cells">{props.cartItem.subtotal} Ft</td>
        </>
    )
}
