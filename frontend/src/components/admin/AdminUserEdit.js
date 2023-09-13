import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { read, update } from "../../repositories/Crud";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-product-edit-del.css";

export default function AdminUserEdit() {

    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    useEffect(() => {
        read(`api/users/${id}`)
            .then(resp => resp.json())
            .then(userData => setFormData(userData.data))
    }, [id])

    function userUpdate(e) {
        e.preventDefault();
        update({ isAdmin: formData.isAdmin }, `api/users/${id}`)
            .then(res => res.json())
            .then((data) => {
                if (data.error) toastTimer(data.error, false)
                else toastTimer("Sikeres módosítás!", true)
                navigate('/admin/felhasznalok')
            })
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-contaniner">
                <table id="admin-product-edit">
                    <caption>
                        Felhasználói adatok szerkesztése
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label>Email-cím: </label></td>
                        <td className="admin-product-edit-td"><input disabled type="text" value={formData.email} placeholder={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="admin">Admin</label></td>
                        <td className="admin-product-edit-td">
                            <input
                                value={formData.isAdmin}
                                type="checkbox"
                                id="admin"
                                checked={formData.isAdmin}
                                onClick={(e) => setFormData(prev => ({ ...formData, isAdmin: !prev.isAdmin }))}
                            />
                        </td>
                    </tr>

                </table>
                <tr className='flex-tr'>
                    <button className="admin-cancel-product-btn" onClick={() => navigate('/admin/felhasznalok')}> Mégse </button>
                    <button className="admin-edit-product-btn save-btn" onClick={(e) => userUpdate(e)}> Módosítás </button>
                </tr>
            </div>
        </div>
    )
}