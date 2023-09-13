import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext.js';
import { update } from "../../repositories/Crud";



export default function addItemToCart(props) {

    const data = { title: props.title, price: props.price }

    update(data, 'api/cart')
        .then(res => res.text())
        .then(resBody => alert(resBody))
} 
