//import '../../assets/style/admintable.css';
//import "../../assets/style/admin.css"
import "../../assets/style/admin-prod-list.css"
export default function AdminSingleProduct (props) {
    return (
        <>
            <td className="table-cells resp">{props.product.id}</td>
            <td className="table-cells resp">{props.product.title}</td>
            <td className="table-cells resp">{props.product.price}</td>
        </>
    )
}