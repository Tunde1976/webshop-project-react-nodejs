import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { read, update } from "../../repositories/Crud";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-product-edit-del.css";
import "../../assets/style/admin-product-create.css";
export default function AdminCategoryEdit() {

    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [message, setMessage, toastTimer] = useContext(ToastContext);
    const navigate = useNavigate();

    useEffect(() => {
        read(`api/categories/${id}`)
            .then(resp => resp.json())
            .then(categoryData => setFormData(categoryData))
    }, [id])

    function categoryUpdate(e) {
        e.preventDefault();

        update(formData, 'api/categories/:id')
            .then(res => res.json())
            .then(respBody => {
                if (respBody.error) toastTimer(respBody.error, false)
                else toastTimer("Sikeres kategória módosítás", true)
                navigate('/admin/kategoriak')
            })
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-contaniner">
                <table id="admin-product-edit">
                    <caption>
                        Kategória módosítása
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label>Kategória:</label></td>
                        <td className="admin-product-edit-td">
                            <input type="text" value={formData.name} placeholder={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </td>
                    </tr>

                </table>
                <div className="add-product-container">
                    <button className="add-product-btn" onClick={(e) => categoryUpdate(e)}>Mentés</button>
                </div>
            </div>
        </div>
    )
}