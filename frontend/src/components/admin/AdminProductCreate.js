import { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../context/ToastContext";
import { create, upload, read } from "../../repositories/Crud";
import "../../assets/style/admin-product-create.css"
import { useNavigate } from "react-router-dom";
//import AdminProductForm from "./AdminProductForm";
import '../../assets/style/admin-product-edit-del.css';
export default function AdminProductCreate() {

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        categoryId: [],
        description: '',
        //image_path: '',
    });

    const [file, setFile] = useState(null);
    const fd = new FormData();
    const [selectCategory, setSelectCategory] = useState([]);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [previewImg, setPreviewImg] = useState("");
    const [message, setMessage, toastTimer] = useContext(ToastContext);
    const navigate = useNavigate();
    console.log(selectCategory);
    console.log(formData, "formdata");

    function previewImage(filetest) {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewImg(fileReader.result)
        }
        if (filetest) {
            fileReader.readAsDataURL(filetest);
        }
    }

    useEffect(() => {
        read("api/categories")
            .then(resp => resp.json())
            .then(categories => setSelectCategory(categories))
    }, [])

    function productCreate() {

        create(formData, 'api/product-register')
            .then(resp => resp.json())
            .then(respBody => {
                return respBody.id
            })
            .then((id) => {
                if (file != null) {
                    fd.append("id", id);
                    fd.append("pic", file);

                    upload(fd, 'api/uploads')
                        .then(resp => resp.json())
                        .then(respBody => {
                            if (respBody.error) toastTimer(respBody.error, false)
                            else {
                                toastTimer("Sikeresen létrehozta a terméket!", true)
                                navigate('/admin/termekek')
                            }
                        })
                }
            })
    };

    function addOrRemoveCheckbox(id) {

        const newCategories = [...formData.categoryId];
        const index = newCategories.indexOf(id);
        if (index === -1) {
            newCategories.push(id);
        } else {
            newCategories.splice(index, 1);
        }
        setFormData({ ...formData, categoryId: newCategories });
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-container">
                <table id="admin-product-edit">
                    <caption>
                        Termékfelvitel
                    </caption>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="title">Terméknév: </label></td>
                        <td className="admin-product-edit-td">
                            <input
                                placeholder="terméknév"
                                id="title"
                                type="text"
                                name="title"
                                value={FormData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="price">Ár: </label></td>
                        <td className="admin-product-edit-td">
                            <input
                                placeholder="ár"
                                id="price"
                                type="text"
                                name="price"
                                value={FormData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label htmlFor="description">Leírás: </label></td>
                        <td className="admin-product-edit-td">
                            <textarea
                                placeholder="leírás"
                                id="description"
                                name="description"
                                value={FormData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </td>
                    </tr>

                    <tr className="admin-product-edit-tr">
                        <td className="admin-product-edit-td"><label>Kategória:</label></td>
                        <td className="admin-product-edit-td">
                            <ul value={formData.categoryId} className="category-select" >
                                {selectCategory.map(category => (
                                    <li>
                                        <label htmlForfor={category.id} className="checkbox-label">
                                            <input type="checkbox" value={category.id} id={category.id} onClick={e => addOrRemoveCheckbox(e.target.value)} />
                                            {category.name}
                                        </label>
                                    </li>
                                ))
                                }
                            </ul>
                        </td>
                    </tr>

                    <tr className="admin-product-edit-tr product-img">
                        <td className="admin-product-edit-td">
                            <label className="custom-file-upload">Képfeltöltés:
                                <input
                                    type="file"
                                    id="id"
                                    name="pic"
                                    accept="image/png, image/jpeg"
                                    onChange={e => { setFile(e.target.files[0]); previewImage(e.target.files[0]) }}
                                />
                            </label>
                        </td>
                        <td className="uploaded-img">
                            {file &&
                                <img src={previewImg} alt="" style={{ width: "300px" }} />
                            }
                        </td>
                    </tr>


                </table>

                <div className="add-product-container">
                    <button className="add-product-btn" onClick={productCreate}>Létrehozás</button>
                </div>
            </div>
        </div >
    )
}