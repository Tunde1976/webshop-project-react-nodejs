import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { read, remove } from "../../repositories/Crud";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-product-edit-del.css";

export default function AdminUserDelete() {

    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    useEffect(() => {
        read(`api/users/${id}`)
            .then(resp => resp.json())
            .then(userData => setFormData({ email: userData.data.email }))
    }, [id])

    console.log(formData);

    function userDelete(e) {
        e.preventDefault();
        remove(`api/users/${id}`)
            .then(res => res.json())
            .then((data) => {
                if (data.error) toastTimer(data.error, false)
                else toastTimer("Sikeres törlés", true)
                navigate('/admin/felhasznalok')
            })
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-contaniner">
                <table id="admin-product-edit">
                    <caption>
                        Felhasználói fiók törlése
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label>Biztosan törölni szeretnéd a/az {formData.email} nevű felhasználót?</label></td>
                    </tr>
                    {/* onlick-nél meghívtad a függvényt, callback-be kell írni */}

                </table>
                    <div className='flex-tr'>
                        <button className="admin-cancel-product-btn" onClick={() => navigate('/admin/felhasznalok')}> Mégsem </button>
                        <button className="admin-edit-product-btn delete-btn" onClick={(e) => userDelete(e)}> Igen </button>
                    </div>
            </div>
        </div>
    )
}