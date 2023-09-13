import { useContext, useState } from "react";
import Order from "../../components/user/Order";
import { CartContext } from "../../context/CartContext";
import { Navigate } from "react-router-dom";

export default function OrderPage(){

    const [cart, setCart] = useContext(CartContext);

    if(Object.keys(cart).length == 0) return <Navigate to='/kosar'/>

    return(
        <>
        {/* <h1>Megrendelés adatok</h1> */}
       
            <Order/>
       
        </>
    )
}