import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { read, remove, partialUpdate } from "../../repositories/Crud";
import AdminSingleOrderDetails from "./AdminSingleOrderDetails";
import { ToastContext } from "../../context/ToastContext";
import '../../assets/style/admin-prod-list.css';
import '../../assets/style/admintable.css';
import '../../assets/style/admin-product-edit-del.css';
import '../../assets/style/admin-order-details.css';

export default function AdminOrderDetails() {


    const [formData, setFormData] = useState({
        status: ""
    });
    console.log("FormData status:", formData)

    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    const [singleOrder, setSingleOrder] = useState([]);
    console.log("singleOrder:", singleOrder)


    useEffect(() => {
        read(`api/orders/${id}`)
            .then((res) => res.json())
            .then((rows) => {
                setSingleOrder(rows)
                setFormData({ status: rows[0].status })
            })

    }, [])

    function deleteHandler() {
        if (window.confirm('Biztosan törli a megrendelést?')) {
            return remove(`api/orders/${id}`)
                .then((res) => res.json())
                .then(backHandler())
                .then(resp => {
                    if (resp.error) toastTimer(resp.error, false)
                    else toastTimer("Sikeres törlés", true)
                    navigate('/admin/megrendelesek')
                })
        }
    }

    function statusHandler() {
        if (window.confirm('Biztosan módosítja a megrendelés státuszát?')) {
            return partialUpdate(formData, `api/orders/${id}`)
                .then((res) => res.json())
                .then(resp => {
                    if (resp.error) toastTimer(resp.error, false)
                    else toastTimer("Sikeres státusz módosítás!", true)
                    navigate('/admin/megrendelesek')
                })
        }
    }

    function backHandler() {
        navigate(`/admin/megrendelesek`)
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-container">
                {singleOrder.length > 0 &&
                    <div>
                        <table className="admin-order-details">
                            <caption>
                                Megrendelés infók
                            </caption>
                            <tr>
                                <td>Megrendelő Id:</td>
                                <td>{singleOrder[0].user_id}</td>
                            </tr>
                            <tr>
                                <td>Megrendelés ID:</td>
                                <td>{singleOrder[0].order_id}</td>
                            </tr>
                            <tr>
                                <td>Megrendelés dátuma</td>
                                <td>{singleOrder[0].created_at}</td>
                            </tr>
                            <tr>
                                <td>Megrendelés total összeg:</td>
                                <td>{singleOrder[0].total_amount} Ft</td>
                            </tr>
                            <tr>
                                <td>Megrendelés státusza:</td>
                                <td>{singleOrder[0].status}</td>
                            </tr>
                            <tr>
                                <td>Megrendelő megjegyzés:</td>
                                <td>{singleOrder[0].extra_info}</td>
                            </tr>
                        </table>
                        <br></br>

                        <table className="admin-order-details">
                            <caption>
                                Számlázási infók
                            </caption>
                            <tr>
                                <td>Vezetéknév:</td>
                                <td>{singleOrder[0].surname}</td>
                            </tr>
                            <tr>
                                <td>Keresztnév:</td>
                                <td>{singleOrder[0].familyname}</td>
                            </tr>
                            <tr>
                                <td>Város:</td>
                                <td>{singleOrder[0].city}</td>
                            </tr>
                            <tr>
                                <td>Utca:</td>
                                <td>{singleOrder[0].street}</td>
                            </tr>
                            <tr>
                                <td>Házszám:</td>
                                <td>{singleOrder[0].house_number}</td>
                            </tr>
                            <tr>
                                <td>Irányítószám:</td>
                                <td>{singleOrder[0].postal_code}</td>
                            </tr>
                        </table>
                        <br></br>

                        <table className="admin-order-details">
                            <caption>
                                Szállítási infók
                            </caption>
                            <tr>
                                <td>Vezetéknév:</td>
                                <td>{singleOrder[0].sh_surname}</td>
                            </tr>
                            <tr>
                                <td>Keresztnév:</td>
                                <td>{singleOrder[0].sh_familyname}</td>
                            </tr>
                            <tr>
                                <td>Város:</td>
                                <td>{singleOrder[0].sh_city}</td>
                            </tr>
                            <tr>
                                <td>Utca:</td>
                                <td>{singleOrder[0].sh_street}</td>
                            </tr>
                            <tr>
                                <td>Házszám:</td>
                                <td>{singleOrder[0].sh_house_number}</td>
                            </tr>
                            <tr>
                                <td>Irányítószám:</td>
                                <td>{singleOrder[0].sh_postal_code}</td>
                            </tr>
                        </table>
                        <br></br>

                        <table className="admin-order-details">
                            <caption>
                                Megrendelt termékek
                            </caption>
                            <tr>
                                <th >Termék azonosító:</th>
                                <th >Termék neve:</th>
                                <th >Termék egységár:</th>
                                <th >Mennyiség:</th>
                            </tr>
                            <>
                                {
                                    singleOrder.map(product => (
                                        <AdminSingleOrderDetails product={product} />
                                    ))
                                }
                            </>
                        </table>
                        <br></br>

                        <table className="admin-order-details">
                            <caption>
                                Megrendelés státusza
                            </caption>
                            <tr>
                                <td><label for="statusOptions"> Megrendelés státusza</label></td>
                                <td>
                                    <select name="statusOptions" value={formData?.status} onChange={(e) => setFormData({ status: e.target.value })}>
                                        <option value="Megrendelés feldolgozás alatt">Megrendelés feldolgozás alatt</option>
                                        <option value="Csomag feladva, kézbesítés folyamatban">Csomag feladva, kézbesítés folyamatban</option>
                                        <option value="Megrendelés teljesítve">Megrendelés teljesítve</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="admin-order-edit-tr">
                                <td className="admin-product-edit-td"><button className="admin-cancel-product-btn delete-btn" onClick={deleteHandler} >Megrendelés törlése</button></td>
                                <td className="admin-product-edit-td"><button className="admin-edit-product-btn save-btn" onClick={statusHandler} >Sátusz módosítása</button></td>
                            </tr>

                        </table>
                        <br></br>
                    </div>
                }
            </div>
        </div >
    )

}