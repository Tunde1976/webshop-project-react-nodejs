export default function UserOrderProductDetails (props) {

    return (
        <>
            <td><img height="2rem" src={`http://localhost:8000/api/${props.product.path}`} alt="Macaroon" /></td>
            <td className="table-cells">{props.product.title}</td>
            <td className="table-cells">{props.product.quantity}</td>
            <td className="table-cells">{props.product.price} Ft</td>
            <td className="table-cells">{props.product.price * props.product.quantity} Ft</td>
           

        </>
    )

}