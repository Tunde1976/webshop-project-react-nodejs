import { useContext, useState } from "react";
import { create } from "../../repositories/Crud";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-category-create.css";
import "../../assets/style/admin-product-edit-del.css";
import { useNavigate } from "react-router-dom";

export default function AdminCategoryCreate() {

    const [formData, setFormData] = useState({
        name: ''
    });

    const [message, setMessage, toastTimer] = useContext(ToastContext);
    const navigate = useNavigate();

    function categoryCreate(e) {
        e.preventDefault();
        create(formData, 'api/category-register')
            .then(res => res.json())
            .then(respBody => {
                console.log(respBody, "bodyy");
                if (respBody.error) toastTimer(respBody.error, false)
                else toastTimer("Sikeres kategória létrehozás", true)
                navigate('/admin/kategoriak')
            })
            .catch(err => console.log(err))
    }

    return (

        <div className="admin-table-wrapper">
            <div className="admin-table-container">
                <table id="admin-product-edit">
                    <caption>
                        Kategóriafelvitel
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="name">Kategórianév</label></td>
                        <td className="admin-product-edit-td">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </td>
                    </tr>


                </table>
                <div className="add-product-container">
                    <button className="add-product-btn" onClick={(e) => categoryCreate(e)}>Létrehozás</button>
                </div>
            </div>
        </div>
    )
}