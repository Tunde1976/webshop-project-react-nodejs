import { read, create } from '../../repositories/Crud';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { BillingAddress, OrderComment, ShippingAddress, OrderCheckbox } from '../../context/OrderContext';
import SingleCart from './SingleCart';
import { v4 as uuidv4 } from 'uuid';
import { ToastContext } from "../../context/ToastContext";
import '../../assets/style/order-form.css';
import '../../assets/style/user-order-details.css';
import '../../assets/style/order-confirm.css';

export default function OrderConfirm() {
    const navigate = useNavigate();
    const [user] = useContext(AuthContext);
    const [cart, setCart] = useContext(CartContext);
    console.log("cart", cart)
    const [billAddress, setBillAddress] = useContext(BillingAddress);
    const [comment, setComment] = useContext(OrderComment);
    const [shippingAddress, setShippingAddress] = useContext(ShippingAddress);
    const [message, setMessage, toastTimer] = useContext(ToastContext);
    const [sameAsBilling, setSameAsBilling] = useContext(OrderCheckbox);

    function orderCreate() {
        console.log("comment 2 obj", comment)

        const data = { ...comment, shippingAddress: { ...shippingAddress }, billAddress: { ...billAddress } }

        create(data, 'api/order')
            .then(resp => resp.json())
            .then(respBody => {
                if (respBody.error) toastTimer(respBody.error, false)
                else toastTimer("Sikeres megrendelés", true)
                navigate('/')
            })

        // .then(
        //     create(billAddress, 'api/billingaddress')
        //         .then(resp => resp.text())
        //         .then(respBody => alert(respBody))
        // )
        // .then(
        //     create(shippingAddress, 'api/shippingaddress')
        //     .then(resp => resp.text())
        //         .then(respBody => alert(respBody))

        // )

    };

    function backHandler() {
        if (sameAsBilling) setShippingAddress({})
        navigate("/megrendeles")
    }

    return (
        <>
            <h2 className='order-h2'>Megrendelés összesítés</h2>

            <h2 className='cart-h2'>Megrendelt termékek</h2>
            <div className="cart-order-wrapper">
                <table className="cart-order">
                    <tr>
                        <th>Terméknév</th>
                        <th>Mennyiség</th>
                        <th>Ár</th>
                        <th>Részösszeg</th>
                    </tr>
                    {cart.lineItems.map((cartItem) => (
                        <tr className="table-row" key={uuidv4()}>
                            <SingleCart cartItem={cartItem} />
                        </tr>
                    )
                    )}
                </table>

                <div className='cart-sum'>
                    <div className='cart-sum-text'>Végösszeg:</div>
                    <div className='cart-sum-price'>{`${cart.totalprice}`} Ft</div>
                </div>
            </div>


            {/* <div className="orderForm--container"> */}
            <div className='another-container'>
                <div className='columns-container-order-confirm'>

                    <div className="orderForm--fields-sum">
                        <h2 className='cart-h2'>Számlázási adatok</h2>
                        <div className='orderForm--fields-content'>
                            <div>
                                <label htmlFor="familyname">Vezetéknév</label>
                                <p>{billAddress.familyname}</p>
                            </div>
                            <div>
                                <label htmlFor="surname">Keresztnév</label>
                                <p>{billAddress.surname}</p>
                            </div>

                            <div>
                                <label htmlFor="city">Város</label>
                                <p>{billAddress.city}</p>
                            </div>

                            <div>
                                <label htmlFor="street">Utca</label>
                                <p>{billAddress.street}</p>
                            </div>
                            <div>
                                <label htmlFor="house_number">Házszám</label>
                                <p>{billAddress.house_number}</p>
                            </div>

                            <div>
                                <label htmlFor="postal_code">Irányítószám</label>
                                <p>{billAddress.postal_code}</p>
                            </div>
                        </div>
                    </div>

                    <div className="orderForm--fields-sum">
                        <h2 className='cart-h2'>Szállítási adatok</h2>
                        <div className='orderForm--fields-content'>
                            <div>
                                <label htmlFor="familyname">Vezetéknév</label>
                                <p>{shippingAddress.familyname}</p>
                            </div>
                            <div>
                                <label htmlFor="surname">Keresztnév</label>
                                <p>{shippingAddress.surname}</p>
                            </div>

                            <div>
                                <label htmlFor="city">Város</label>
                                <p>{shippingAddress.city}</p>
                            </div>

                            <div>
                                <label htmlFor="street">Utca</label>
                                <p>{shippingAddress.street}</p>
                            </div>
                            <div>
                                <label htmlFor="house_number">Házszám</label>
                                <p>{shippingAddress.house_number}</p>
                            </div>

                            <div>
                                <label htmlFor="postal_code">Irányítószám</label>
                                <p>{shippingAddress.postal_code}</p>
                            </div>
                        </div>
                    </div>

                    <div className="orderForm--fields-sum">
                        <h2 className='cart-h2'>Megjegyzés a rendeléshez</h2>
                        <div className='orderForm--fields-content'>
                            <div>
                                <p>{comment.extra_info}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='order-confirm-container'>
                    <div>
                        <div >
                            <button id="order-confirm" onClick={backHandler}>vissza</button>
                        </div>
                        <div>
                            <button id="order-confirm" onClick={orderCreate}>Megrendelés elküldése</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}

        </>
    )

}