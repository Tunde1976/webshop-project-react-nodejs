import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { read, update } from "../../repositories/Crud";
import AdminSingleProduct from "./AdminSingleProduct";
import { ToastContext } from "../../context/ToastContext";
//import AdminProductForm from "./AdminProductForm";
import "../../assets/style/admin-product-edit-del.css";

export default function AdminProductEdit() {

    const [message, setMessage, toastTimer] = useContext(ToastContext)

    const pathParameters = useParams();
    console.log(pathParameters.id);

    const navigate = useNavigate()

    const [product, setProduct] = useState({});

    const [formData, setFormData] = useState({
        title: `${product?.title}`,
        price: `${product?.price}`,
        categoryId: `${product?.categories}`,
        description: `${product?.description}`,
        //image_path: '',
    });

    const [selectCategory, setSelectCategory] = useState([]);

    useEffect(() => {
        read(`api/product/${pathParameters.id}`)
            .then((res) => res.json())
            .then((obj) => setFormData({ title: obj.data.title, price: obj.data.price, categoryId: obj.data.categories.map(cat => cat.category_id), description: obj.data.description }))
    }, [pathParameters.id])
    console.log("product:", product);
    console.log("formdata", formData);

    useEffect(() => {
        read("api/categories")
            .then(resp => resp.json())
            .then(categories => {console.log(categories); setSelectCategory(categories)})
    }, [])

    function backHandler() {
        navigate(`/admin/termekek`)
    }

    function updateHandler() {
        if (window.confirm('Módosítja a terméket?')) {
            update(formData, `api/products/${pathParameters.id}`)
                .then(resp => resp.json())
                .then(respBody => {
                    if (respBody.error) toastTimer('Sikertelen termékmódosítás', false)
                    else toastTimer(`sikeresen módosítottad a terméket, id: ${respBody.id}`, true)
                    navigate('/admin/termekek')
                }
                )
        } else {
            return null
        };
    }

    function addOrRemoveCheckbox(id) {

        const newCategories = [...formData.categoryId];
        const index = newCategories.indexOf(Number(id));
        if (index === -1) {
            newCategories.push(Number(id));
        } else {
            newCategories.splice(index, 1);
        }
        setFormData({ ...formData, categoryId: newCategories });

    }

    // function addOrRemoveCheckbox(id) {
    //    console.log(id, 'id');
    //     const newCategories = [...formData.categoryId];
    //     console.log(Object.values(newCategories), "new");
    //     const index = newCategories.map(cat => cat.category_id).indexOf(Number(id))
    //     console.log(index, "index");
    //     if (index == -1) {
    //         newCategories.push({category_id: Number(id), name: ""});
    //     } else {
    //         newCategories.splice(index, 1);
    //     }
    //     setFormData({...formData, categoryId: newCategories});

    // }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-contaniner">
                <table id="admin-product-edit">
                    <caption>
                        Termékek szerkesztése
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="title">Terméknév: </label></td>
                        <td className="admin-product-edit-td"><input className="input-name" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="price">Ár: </label></td>
                        <td className="admin-product-edit-td"><input className="input-price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label>Kategória:</label></td>
                        <td className="admin-product-edit-td">
                            <ul value={formData.categoryId} className="category-select" >
                                {selectCategory?.map(category => (
                                    <li>
                                        <input
                                            type="checkbox"
                                            value={category.id}
                                            id={category.id}
                                            onClick={e => addOrRemoveCheckbox(e.target.value)}
                                            checked={formData.categoryId?.includes(category.id)} />
                                        <label htmlFor={category.id}> {category.name}</label>
                                    </li>
                                ))
                                }
                            </ul>
                        </td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="description">Leírás: </label></td>
                        <td className="admin-product-edit-td"><input className="input-description" type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></td>
                    </tr>

                    <div className="table-body">
                        <AdminSingleProduct product={product} />
                    </div>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><button className="admin-cancel-product-btn" onClick={backHandler}>Mégsem</button></td>
                        <td className="admin-product-edit-td" id="edit-right"><button className="admin-edit-product-btn" onClick={updateHandler}>Mentés</button></td>
                    </tr>

                    {/* <select value={formData.categoryId} className="category-select" onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                    <option value="">Kategória</option>
                    {selectCategory.map(cat => <option value={cat.id}>{cat.name}</option>)}
                </select> */}

                    {/* <div className="admin-product-btn-container">
                        <button className="admin-edit-product-btn" onClick={updateHandler}>Mentés</button>
                        
                        <button className="admin-cancel-product-btn" onClick={backHandler}>Mégsem</button>
                    </div> */}
                </table>
            </div>
        </div>
    )

}