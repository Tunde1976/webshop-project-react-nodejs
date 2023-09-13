//import { read, create } from '../../repositories/Crud';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { validateNotEmpty } from '../../utils/validationUtil';
import { BillingAddress, OrderCheckbox, OrderComment, ShippingAddress } from '../../context/OrderContext';
import '../../assets/style/order-form.css';
import '../../assets/style/user-order-details.css';
import OrderErrorMessages, { ValidOrderForm, OrderShippingMessages } from '../../context/OrderErrorMessages';

export default function Order() {
    const navigate = useNavigate();
    const [user] = useContext(AuthContext);
    const [cart, setCart] = useContext(CartContext);
    const [billAddress, setBillAddress] = useContext(BillingAddress);
    const [comment, setComment] = useContext(OrderComment);
    const [shippingAddress, setShippingAddress] = useContext(ShippingAddress);
    const [errorMessage, setErrorMessage] = useContext(OrderErrorMessages);
    const [shipErrorMessage, setShipErrorMessage] = useContext(OrderShippingMessages);
    const [valid, setValid] = useContext(ValidOrderForm);

    const [sameAsBilling, setSameAsBilling] = useContext(OrderCheckbox);

    const [formData, setFormData] = useState({
        surname: billAddress.surname ? billAddress.surname : "",
        familyname: billAddress.familyname ? billAddress.familyname : "",
        city: billAddress.city ? billAddress.city : "",
        street: billAddress.street ? billAddress.street : "",
        house_number: billAddress.house_number ? billAddress.house_number : "",
        postal_code: billAddress.postal_code ? billAddress.postal_code : "",

    })
    const [commentData, setCommentData] = useState({
        extra_info: comment.extra_info ? comment.extra_info : "",

    })

    const [shippingFormData, setShippingFormData] = useState({
        surname: shippingAddress.surname ? shippingAddress.surname : "",
        familyname: shippingAddress.familyname ? shippingAddress.familyname : "",
        city: shippingAddress.city ? shippingAddress.city : "",
        street: shippingAddress.street ? shippingAddress.street : "",
        house_number: shippingAddress.house_number ? shippingAddress.house_number : "",
        postal_code: shippingAddress.postal_code ? shippingAddress.postal_code : "",

    })

    // console.log("FormData:", formData);
    // console.log("shippingFormData:", shippingFormData);
    // console.log("commentData:", commentData);

    useEffect(() => {
        if (sameAsBilling) {
            const isDisabled = Object.values(errorMessage).some(data => data != "")
            console.log(Object.values(errorMessage), "message array");
            console.log(isDisabled, "disabled");
            setValid(isDisabled)
        } else {
            const isDisabled = Object.values(errorMessage).some(data => data != "") || Object.values(shipErrorMessage).some(data => data != "")
            setValid(isDisabled)
        }

    }, [errorMessage, sameAsBilling, shipErrorMessage])


    function navigateToOrderConfirm() {
        setBillAddress(formData);
        if (sameAsBilling) setShippingAddress(formData)
        else setShippingAddress(shippingFormData);
        console.log("ShippingAddress:", shippingAddress)
        setComment({ ...commentData, totalPrice: cart.totalprice });


        navigate("/megrendeles/osszesites");
        console.log("BillAddress:", billAddress);
        console.log("comment:", comment);
    }

    function sameAsBillingAddress() {

        if (sameAsBilling) {
            setSameAsBilling(false);

        } else {
            setSameAsBilling(true);
        }

    }


    return (
        <>
            <h2 className="cart-h2">Megrendelés adatok</h2>

            <div className="orderForm--container">
                <div className='another-container'>
                    <div className='columns-container'>
                        <div className="orderForm--fields">

                            <label htmlFor="surname">Keresztnév*</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={e => {
                                    setFormData({ ...formData, surname: e.target.value });
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, surname: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, surname: "" }))

                                    // setShippingFormData({...shippingFormData, surname: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.surname && errorMessage.surname}</p>

                            <label htmlFor="familyname">Vezetéknév*</label>
                            <input
                                type="text"
                                name="familyname"
                                value={formData.familyname}
                                onChange={e => {
                                    setFormData({ ...formData, familyname: e.target.value });
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, familyname: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, familyname: "" }))
                                    // setShippingFormData({...shippingFormData, familyname: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.familyname && errorMessage.familyname}</p>
                            <label htmlFor="city">Város*</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={e => {
                                    setFormData({ ...formData, city: e.target.value })
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, city: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, city: "" }))
                                    // setShippingFormData({...shippingFormData, city: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.city && errorMessage.city}</p>

                            <label htmlFor="street">Utca*</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={e => {
                                    setFormData({ ...formData, street: e.target.value });
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, street: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, street: "" }))

                                    // setShippingFormData({...shippingFormData, street: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.street && errorMessage.street}</p>

                            <label htmlFor="house_number">Házszám*</label>
                            <input
                                type="text"
                                name="house_number"
                                value={formData.house_number}
                                onChange={e => {
                                    setFormData({ ...formData, house_number: e.target.value })
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, housenum: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, housenum: "" }))

                                    // setShippingFormData({...shippingFormData, house_number: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.housenum && errorMessage.housenum}</p>

                            <label htmlFor="postal_code">Irányítószám*</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={e => {
                                    setFormData({ ...formData, postal_code: e.target.value });
                                    if (!validateNotEmpty(e.target.value)) setErrorMessage(prev => ({ ...prev, code: "Mező kitöltése kötelező" }))
                                    else setErrorMessage(prev => ({ ...prev, code: "" }))

                                    // setShippingFormData({...shippingFormData, postal_code: e.target.value})
                                }
                                }
                            />
                            <p>{errorMessage.code && errorMessage.code}</p>

                            <label htmlFor="extra_info">Megjegyzés</label>
                            <input
                                type="text"
                                name="extra_info"
                                value={commentData.extra_info}
                                onChange={e => setCommentData({ ...commentData, extra_info: e.target.value })}
                            />

                        </div>

                        <div className='orderForm--fields-shipping-address'>
                            <label for="shippingCheckbox">A szállítási cím megegyezik a számlázási címmel</label>
                            <input type="checkbox" name="shippingCheckbox" onClick={sameAsBillingAddress} checked={sameAsBilling} />
                            {sameAsBilling ?
                                <p>A számlázási és szállítási cím megegyezik</p>

                                :

                                <div className='orderForm--fields-shipping-address-details'>
                                    <label htmlFor="surname">Keresztnév*</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={shippingFormData.surname}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, surname: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shipsurname: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shipsurname: "" }))
                                        }}
                                    />
                                    <p>{errorMessage.shipsurname && errorMessage.shipsurname}</p>

                                    <label htmlFor="familyname">Vezetéknév*</label>
                                    <input
                                        type="text"
                                        name="familyname"
                                        value={shippingFormData.familyname}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, familyname: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shipfamilyname: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shipfamilyname: "" }))

                                        }}
                                    />
                                    <p>{errorMessage.shipfamilyname && errorMessage.shipfamilyname}</p>

                                    <label htmlFor="city">Város*</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingFormData.city}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, city: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shipcity: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shipcity: "" }))

                                        }}
                                    />
                                    <p>{errorMessage.shipcity && errorMessage.shipcity}</p>

                                    <label htmlFor="street">Utca*</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={shippingFormData.street}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, street: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shipstreet: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shipstreet: "" }))

                                        }}
                                    />
                                    <p>{errorMessage.shipstreet && errorMessage.shipstreet}</p>
                                    <label htmlFor="house_number">Házszám*</label>
                                    <input
                                        type="text"
                                        name="house_number"
                                        value={shippingFormData.house_number}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, house_number: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shiphousenum: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shiphousenum: "" }))

                                        }}
                                    />
                                    <p>{errorMessage.shiphousenum && errorMessage.shiphousenum}</p>

                                    <label htmlFor="postal_code">Irányítószám*</label>
                                    <input
                                        type="text"
                                        name="postal_code"
                                        value={shippingFormData.postal_code}
                                        onChange={e => {
                                            setShippingFormData({ ...shippingFormData, postal_code: e.target.value })
                                            if (!validateNotEmpty(e.target.value)) setShipErrorMessage(prev => ({ ...prev, shipcode: "Mező kitöltése kötelező" }))
                                            else setShipErrorMessage(prev => ({ ...prev, shipcode: "" }))

                                        }}
                                    />

                                </div>
                            }

                        </div>
                    </div>

                    <div className='order-confirm-container'>
                        <button id="order-confirm" onClick={navigateToOrderConfirm} disabled={valid}>Adatok elküldése</button>
                    </div>
                </div>
            </div>
        </>
    )


}