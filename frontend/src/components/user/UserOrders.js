import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react"
import { read } from "../../repositories/Crud";
import UserSingleOrderDetails from "./UserSingleOrderDetails";
import { AuthContext } from "../../context/AuthContext";
import "../../assets/style/user-order-table.css"
import "../../assets/style/cart.css";
import '../../assets/style/order-form.css';
import '../../assets/style/user-order-details.css';
import '../../assets/style/order-confirm.css';

export default function UserOrders() {
    const [user, setUser] = useContext(AuthContext)
    console.log("user:", user)
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        read(`api/userorders/${user.localID}`)
            .then((res) => res.json())
            .then((rows) => setUserOrders(rows))
    }, []);

    return (
        <>
            {/* <h2 className="order-h2">Rendeléseim</h2> */}
            {
                <div className="cart-order-wrapper">
                    <table className="cart-order">
                        <tr>
                            <th>Sorszám</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th></th>
                        </tr>

                        {
                            userOrders.map(order => (
                                <tr className="table-row" key={order.order_id}>
                                    <UserSingleOrderDetails order={order} />
                                    <td className="table-cells">
                                        <Link to={`/auth/profile/megrendelesek/termekek/${order.order_id}`}>Részletek

                                        </Link>
                                    </td>
                                </tr>
                            )
                            )
                        }
                    </table>
                </div>
            }


        </>
    )
}