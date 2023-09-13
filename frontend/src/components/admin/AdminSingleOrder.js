export default function AdminSingleOrder (props) {
    return (
        <>
            <td className="ot-cell">{props.order.order_id}</td>
            <td className="ot-cell">{props.order.created_at}</td>
            <td className="ot-cell">{props.order.status}</td> 
        </>
    )
}