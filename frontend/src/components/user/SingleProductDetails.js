import { NavLink } from "react-router-dom";
import { FaShoppingBag, FaHeart, FaAngleLeft } from "react-icons/fa";
import { update } from "../../repositories/Crud";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/single-product-details.css";

export default function SingleProductDetails(props) {

    console.log(props, "props");
    const [user] = useContext(AuthContext);
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    function addItemToCart() {
        const data = { user_id: user.localID, product_id: props.product.id }
        update(data, 'api/cart')
            .then(res => res.json())
            .then((data) => {
                if(data.error) toastTimer(data.error, false)
                else toastTimer("Sikeresen a kosárhoz adta!", true)
            })            
    }

    return (
        <div className="product-details-container">
            <div className="card">
                <nav>
                    <NavLink className="nav-link" to={"/termekek"}>
                        <FaAngleLeft />
                        <p className="back-to-products">Vissza a termékekhez</p>
                    </NavLink>
                </nav>
                <div className="photo">
                    <img src={`http://localhost:8000/api/${props.product.path}`} alt="Macaroon" />
                </div>
                <div className="description">
                    <h2>{props.product.title}</h2>
                    <div className="product-category">
                    {
                        props.product.categories?.map(cat => (
                            <span>{cat.name}</span>
                        ))
                    }
                    </div>
                    <p>{props.product.description}</p>
                    <h1>{props.product.price} Ft</h1>
                    <FaShoppingBag className="shop-icon" onClick={addItemToCart} />
                    <FaHeart className="heart-icon" />
                </div>
            </div>
        </div>

    )


}