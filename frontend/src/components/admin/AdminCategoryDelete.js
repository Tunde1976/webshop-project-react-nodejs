import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { read, remove } from "../../repositories/Crud";
import { ToastContext } from "../../context/ToastContext";
import "../../assets/style/admin-product-edit-del.css";
import "../../assets/style/admin-product-create.css";
export default function AdminCategoryDelete() {
    
    const { id } = useParams();
    const [formData, setFormData] = useState ({});
    const navigate=useNavigate();
    const [message, setMessage, toastTimer] = useContext(ToastContext)

    useEffect(()=>{
        read(`api/categories/${id}`)
        .then(resp=>resp.json())
        .then(categoryData=>setFormData(categoryData))
    }, [id] )

    function categoryDelete(e) {
        e.preventDefault();
        remove(`api/categories/${id}`)
            .then(res=>res.json())
            .then((data) => {
                if(data.error) toastTimer(data.error, false)
                else toastTimer("Sikeres kategória törlés", true)
                navigate('/admin/kategoriak')
            })     
    }
    
    return(
        
        <div className="admin-table-wrapper">
        <div className="admin-table-contaniner">
            <table id="admin-product-edit">
                <caption>
                    Kategória törlése
                </caption>

                <tr className="admin-product-edit-tr">
                    <td className="admin-product-edit-td">{formData.name}</td>
                </tr>


            </table>
            <div className="add-product-container">
                <button className="admin-del-productdel-btn delete-btn" onClick={(e)=>categoryDelete(e)}>Törlés</button>
            </div>
        </div>
    </div>


    )
}