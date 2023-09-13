import React, { useEffect, useState } from 'react';
import { read } from '../../repositories/Crud';
import AdminSingleCategory from './AdminSingleCategory';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import '../../assets/style/admin-categories-table.css';
import del from '../../assets/pictures/delete-black.png';
import edit from '../../assets/pictures/edit-black.png';
export default function AdminCategoryList() {

    const [adminCategoriesData, setAdminCategoriesData] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectValue, setSelectValue] = useState("order");
    const itemsPerPage = 8;

    useEffect(() => {
        read('api/categories')
            .then((resp) => resp.json())

            .then((obj) => {
                console.log('Obj', obj);
                setAdminCategoriesData(obj.data);
            });

    }, [])

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage, selectValue]);

    const fetchCategories = async (page) => {
        try {
            const orderBy = (selectValue && selectValue !== "order") ? selectValue.split("-")[0] : null;
            const order = (selectValue && selectValue !== "order") ? selectValue.split("-")[1] : null;
            console.log(orderBy, order, "rendezés");
            const res = await read(`api/categories?page=${page}&orderBy=${orderBy}&order=${order}`);
            const obj = await res.json();
            console.log('Obj', obj);
            setAdminCategoriesData(obj.categories);
            setTotalPages(obj.totalPages);
        } catch (error) {
            console.error('Hiba történt a termékek lekérdezésekor.', error);
        }
    };

    console.log('adminCategoriesData', adminCategoriesData);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className="table">
            <div className="select-option">
                <select value={selectValue} id="ordered-list" onChange={(e) => setSelectValue(e.target.value)} >
                    <option value="order">Rendezés</option>
                    <option value="name-asc">Név szerint növekvő</option>
                    <option value="name-desc">Név szerint csökkenő</option>
                    <option value="id-asc">Sorszám szerint növekvő</option>
                    <option value="id-desc">Sorszám szerint csökkenő</option>
                </select>
            </div>
            <div className="table-header">
                <div className="table-wrapper">
                    <div className='table-container'>
                        <table className='category-table'>
                            <caption>
                                Termékkategóriák
                            </caption>
                            <tr>
                                <th>Sorszám</th>
                                <th>Kategória megnevezése</th>
                                <th>Módosítás</th>
                                <th>Törlés</th>
                            </tr>

                            {
                                adminCategoriesData?.map(category => (
                                    <tr>
                                        {/* // <div className="table-row" key={uuidv4()}> */}
                                        <AdminSingleCategory category={category} className="table-row" key={uuidv4()} />
                                        <td className='table-cells'><Link to={`/admin/kategoriak/modositas/${category.id}`}><img className='edit' src={edit} alt='edit' style={{ width: '20px' }} /></Link></td>
                                        <td className='table-cells'><Link to={`/admin/kategoriak/torles/${category.id}`}><img className='del' src={del} alt='del' style={{ width: '20px' }} /></Link></td>
                                        {/* // </div> */}
                                    </tr>
                                )
                                )}
                        </table>
                        <div className="pagination-buttons">
                            <button onClick={handlePrevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Vissza</button>
                            <br></br>
                            <button onClick={handleNextPage} className={adminCategoriesData && currentPage >= totalPages ? "disabled" : ""} disabled={adminCategoriesData && currentPage >= totalPages}>Előre</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}