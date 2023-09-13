export default function UserSingleOrderDetails(props) {

    return (
        <>

            <td className="table-cells">{props.order.order_id}</td>
            <td className="table-cells">{props.order.created_at}</td>
            <td className="table-cells">{props.order.status}</td>
           

        </>
    )
}