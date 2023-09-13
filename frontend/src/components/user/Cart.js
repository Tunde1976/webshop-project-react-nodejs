import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from "react-router-dom";
import { read, remove, update } from '../../repositories/Crud';
import { CartContext } from '../../context/CartContext.js';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from "../../context/ToastContext";
import SingleCart from './SingleCart';
import del from '../../assets/pictures/delete-black.png';
//import "../../assets/style/admintable.css";
import "../../assets/style/admin-prod-list.css";
import "../../assets/style/cart-spec-offer-banner.css";
import "../../assets/style/cart.css";
//import { useNavigate, useParams } from "react-router-dom";
import macaronbox from './macaronbox.jpg';
import macaronbox2 from './macaronbox2.jpg';
import purplebox from '../../assets/pictures/purplebox.jpg';
export default function Cart() {
    const navigate = useNavigate();
    const [user] = useContext(AuthContext);
    const [cart, setCart] = useContext(CartContext);
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    const [specOffer, setSpecOffer] = useState({});
    const [chooseOffer, setChooseOffer] = useState(false);


    //ezt dinamikusan kigenerálni
    // kell egy végpont a products/special/:categoryId -> 
    const specialId = "special";
    useEffect(() => {
        read(`api/product/special/${specialId}`)
            .then((resp) => resp.json())
            .then((obj) => {
                console.log('specialOfferObj', obj);
                setSpecOffer(obj);
            });
    }, [])

    useEffect(() => {
        console.log(user, "user cart");
        // if(Object.keys(cart).length > 0 && cart.lineItems.length > 0) {
        read('api/cart')
            .then((resp) => resp.json())
            .then((obj) => {
                console.log('obj', obj);
                setCart(obj);
            });

        // }
    }, [user.localID])


    console.log('cartData, user', cart, user);

    function itemPlus(e, productid, quantity) {
        e.preventDefault();
        const newQuantity = { quantity: quantity + 1 };
        update(newQuantity, `api/cart/${productid}`)
            .then(res => res.json())
            .then(data => {
                console.log(data, "data")
                console.log(cart, "cart map előtt")
                // return kellett, plusz if-be tettem, és kell a két egyenlőség jel
                const newCart = cart.lineItems.map(item => {
                    console.log(item, "item");
                    if (item.product_id == data.productid) return ({ ...item, quantity: data.quantity, subtotal: data.quantity * item.price })
                    else return item
                })
                console.log(newCart, "newcart")
                const newtotalprice = newCart.reduce((acc, item) => acc + item.subtotal
                    , 0)
                setCart({ ...cart, totalprice: newtotalprice, lineItems: newCart })

            })
    }

    function addItemToCart(productId) {
        if (!user.message) {
            const data = { user_id: user.localID, product_id: productId }
            console.log(data, "data cart");
            update(data, 'api/cart')
                .then(res => res.text())
                .then(() => toastTimer("Sikeresen a kosárhoz adta!", true))
        }
        else {
            toastTimer("A kosárba helyezéshez jelentkezz be!", false)
        }
    }

    function addOfferToCart() {

        const specialProduct = { product_id: specOffer.data.product_id, title: specOffer.data.title, price: specOffer.data.price, quantity: 1, subtotal: 1 * specOffer.data.price }
        cart.lineItems.push(specialProduct)
        const newtotalprice = cart.lineItems.reduce((acc, item) => acc + item.subtotal, 0);
        setCart({ ...cart, totalprice: newtotalprice })
        console.log("cartWithOffer:", cart);
        addItemToCart(specOffer.data.product_id)

        /*update(cartWithOffer, `api/cart/`)
            .then(res => res.json())
            .then(data => {
                console.log("cartWithOffer data", data);

                const newCartWithOffer = cart.lineItems.map(item => {
                    
                    if (item.product_id == specOffer.data.product_id) return ({ ...item, subtotal: item.price })
                    else return item
                })
                //console.log(newCart, "newcart")
                const newtotalprice = newCartWithOffer.reduce((acc, item) => acc + item.subtotal
                    , 0)
                setCart({ ...cart, totalprice: newtotalprice, lineItems: cartWithOffer })

            })*/
    }

    function itemMinus(e, productid, quantity) {
        e.preventDefault();
        const newQuantity = { quantity: quantity > 1 ? quantity - 1 : 1 };
        update(newQuantity, `api/cart/${productid}`)
            .then(res => res.json())
            .then(data => {
                console.log(data, "data")
                console.log(cart, "cart map előtt")
                const newCart = cart.lineItems.map(item => {
                    console.log(item, "item");
                    if (item.product_id == data.productid) return ({ ...item, quantity: data.quantity, subtotal: data.quantity * item.price })
                    else return item
                })
                console.log(newCart, "newcart")
                const newtotalprice = newCart.reduce((acc, item) => acc + item.subtotal
                    , 0)
                setCart({ ...cart, totalprice: newtotalprice, lineItems: newCart })
            })
    }

    function itemDelete(e, productid) {
        e.preventDefault();
        remove(`api/cart/${productid}`)
            .then(res => res.json())
            .then(data => {
                const newCart = cart.lineItems.filter(item => item.product_id != data.productid)
                const newtotalprice = newCart.reduce((acc, item) => acc + item.subtotal
                    , 0)
                setCart({ ...cart, totalprice: newtotalprice, lineItems: newCart })
                if (productid == specOffer.data.product_id) {
                    setChooseOffer(false)
                }
            })
    }

    function navigateToOrder() {
        navigate("/megrendeles")
    }

    function orderOffer(e) {
        if (chooseOffer) {
            setChooseOffer(false);
            itemDelete(e, specOffer.data.product_id)
        } else {
            setChooseOffer(true);
            addOfferToCart()
        }
    }

    return (
        <>
            {Object.keys(user).length > 1 ? (
                (Object.keys(cart).length > 0 && cart.lineItems.length > 0) ? (

                    <div className="cart-order-wrapper">
                        <table className="cart-order">
                            <tr>
                                <th>Terméknév</th>
                                <th>Mennyiség</th>
                                <th>Ár</th>
                                <th>Részösszeg</th>
                                <th>Mennyiség csökkentése</th>
                                <th>Mennyiség növelése</th>
                                <th>Törlés</th>
                            </tr>

                            {
                                cart.lineItems.map((cartItem) => (
                                    <tr className="table-row" key={uuidv4()}>
                                        <SingleCart cartItem={cartItem} />
                                        <td className="table-cells"><button className="cart-amount-btn" onClick={(e) => itemMinus(e, cartItem.product_id, cartItem.quantity)}>-</button></td>
                                        <td className="table-cells"><button className="cart-amount-btn" onClick={(e) => itemPlus(e, cartItem.product_id, cartItem.quantity)}>+</button></td>
                                        <td className="table-cells"><button className="cart-amount-btn" onClick={(e) => itemDelete(e, cartItem.product_id)}><img className='cart-amount-btn' src={del} alt='del' style={{ width: '20px' }} /></button></td>
                                    </tr>
                                )
                                )
                            }
                        </table >

                        <div className='special-offer-and-cart-sum-container'>

                        <div className='cart-sum-container'>
                                <div className='cart-sum'>
                                    <div className='cart-sum-text'>Végösszeg:</div>
                                    <div className='cart-sum-price'>{`${cart.totalprice}`} Ft</div>
                                </div>

                                <div className='order-btn-container'>
                                    <button className='order-btn' onClick={navigateToOrder}>Megrendelés</button>
                                </div>
                            </div>

                            <div className="special-offer--container">
                                <div className="spec-offer--img-container"><img id="offer-img" src={purplebox} alt="box" /></div>
                                <div className="spec-offer--data-container">
                                    <h2>KÜLÖNLEGES NYÁRI AJÁNLAT</h2>
                                    <p className="subtitle"> Tedd teljessé Macaron élményed! </p>
                                    <p> Csodaszép Macaron díszdoboz csak {specOffer.data?.price} Ft-ért!</p>
                                    <div className="cta-icon--container">
                                        <p>Kérem a díszdobozt is!</p>
                                        <p><input type="checkbox" name="orderBump" onChange={orderOffer} checked={chooseOffer} /></p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                ) : (
                    <td className="cart-empty-container">
                        A kosár jelenleg üres!
                    </td>
                )) : (
                <td className="cart-empty-container">
                    A kosár megtekintéséhez jelentkezz be!
                </td>
            )
            }

        </>
    )
}
