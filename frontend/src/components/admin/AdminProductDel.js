import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { read, remove } from '../../repositories/Crud';
import AdminSingleProduct from './AdminSingleProduct';
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-product-edit-del.css";
export default function AdminProductDel() {

    const pathParameters = useParams();
    console.log(pathParameters.id);
    const [product, setProduct] = useState([]);
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    const navigate = useNavigate();

    useEffect(() => {

        read(`api/product/${pathParameters.id}`)
            .then((res) => res.json())
            .then((obj) => setProduct(obj.data))

    }, [])

    function deleteProductHandler() {
        if (window.confirm(`Biztosan törli a következő terméket?`)) {
            remove(`api/products/${pathParameters.id}`)
                .then(resp => resp.json())
                .then((respbody) => {
                    if (respbody.error) toastTimer(respbody.error, false)
                    else toastTimer(respbody.message, true)
                    navigate('/admin/termekek')
                })
        }

        else return null
    }

    function backHandler() {
        navigate(`/admin/termekek`)
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-contaniner">
                <table id="admin-product-edit">
                    <caption>
                        Termékek törlése
                    </caption>

                    <tr>
                        <th>Cikkszám</th>
                        <th>Megnevezés</th>
                        <th>Ár</th>
                    </tr>

                    <tr>
                        <AdminSingleProduct product={product} />
                    </tr>


                </table>
                    <div className='flex-tr'>
                        <button className="admin-cancel-productdel-btn" onClick={backHandler}>Mégsem</button>
                        <button className="admin-del-productdel-btn" onClick={deleteProductHandler}>Törlés</button>
                    </div>
            </div>
        </div>
    )
}