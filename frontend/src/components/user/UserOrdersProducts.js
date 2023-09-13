import { useState, useEffect } from "react";
import { read } from "../../repositories/Crud";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import UserOrderProductDetails from "./UserOrderProductDetails";
import "../../assets/style/user-order-details.css";
import "../../assets/style/cart.css";

export default function UserOrdersProducts() {

    const [user] = useContext(AuthContext)
    console.log("user:", user)
    const { id } = useParams();
    console.log("orderId:", id)
    const [products, setProducts] = useState([]);
    console.log("Products:", products)

    useEffect(() => {
        read(`api/orders/${id}`)
            .then((res) => res.json())
            //.then ((rows) => console.log("rows:", rows))
            .then((rows) => setProducts(rows))

    }, []);

    return (
        <>
            <section className="user-orders-container">
                <div>
                    <h2 className="cart-h2">Megrendelt termékek</h2>
                    <div className="cart-order-wrapper">
                        <table className="cart-order">
                            <tr>
                                <th></th>
                                <th>Termék</th>
                                <th>Mennyiség</th>
                                <th>Egységár</th>
                                <th>Összesen</th>
                            </tr>
                            {
                                products.map(product => (
                                    <tr className="table-row">
                                        <UserOrderProductDetails product={product} />
                                    </tr>
                                )
                                )
                            }
                        </table>
                        <h2 className="order-h2">Végösszeg: <span>{products[0]?.total_amount} Ft</span></h2>
                    </div>
                </div>

                <div className="order-data">
                    <h2 className="order-h2">Számlázási cím</h2>
                    <p>{products[0]?.familyname} {products[0]?.surname}</p>
                    <p>{products[0]?.city}</p>
                    <p>{products[0]?.street} utca {products[0]?.house_number}</p>
                    <p>{products[0]?.postal_code}</p>

                    <h2 className="order-h2">Szállítási cím</h2>
                    <p>{products[0]?.sh_familyname} {products[0]?.sh_surname}</p>
                    <p>{products[0]?.sh_city}</p>
                    <p>{products[0]?.sh_street} utca {products[0]?.sh_house_number}</p>
                    <p>{products[0]?.sh_postal_code}</p>

                    <h2 className="order-h2">Státusz: <span>{products[0]?.status}</span></h2>

                </div>
            </section>



        </>
    )

}