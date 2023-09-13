import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext.js';
import { update } from "../../repositories/Crud";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components"
import { ToastContext } from "../../context/ToastContext";
import '../../assets/style/single-product-card.css';


export default function SingleProduct(props) {

    const [user] = useContext(AuthContext);
    const [message, setMessage, toastTimer] = useContext(ToastContext)
    console.log(user);

    function addItemToCart() {
        if (!user.message){
            const data = { user_id: user.localID, product_id: props.product.id }
            console.log(data);
            update(data, 'api/cart')
                .then(res => res.text())
                .then(() => toastTimer("Sikeresen a kosárhoz adta!", true))
        } else{
            toastTimer("A kosárba helyezéshez jelentkezz be!", false)
    }}

    const ProductCard = styled.div`
        &:hover {
        background-color: ${props.bgcolor}
    }
    `;

    return (
        <>
            <div className={`single-productBox single-productBox--type1 single-productBox--green`}>
                <ProductCard>
                    {/* <div className="img-container"> */}
                    <div className="single-productBox-img">
                        <img src={`http://localhost:8000/api/${props.product.path}`} alt="Macaroon" />
                    </div>

                    <div className="single-productBox-overlay"  onClick={(e) => addItemToCart(e)}>
                        <a href="#">
                            <ProductCard>
                                <div className="single-productBox-overlayIcon" >
                                    <i className="fa fa-shopping-cart"></i><FaShoppingCart />
                                </div>
                            </ProductCard>
                        </a>
                    </div>

                    <a href="#" className="single-productBox-content">
                        <NavLink to={`/termek/${props.product.id}`}>
                            <h4 className="single-productBox-title text-uppercase">{props.product.title}</h4>
                        </NavLink>

                        <p className="product-price">{props.product.price} Ft</p>
                    </a>

                </ProductCard>
            </div>
        </>
    )
}