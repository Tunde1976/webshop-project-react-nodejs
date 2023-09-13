import React, { useContext, useEffect, useState } from 'react';
import { read } from '../../repositories/Crud';
import AdminSingleProduct from './AdminSingleProduct';
//import { v4 as uuidv4 } from 'uuid';
import '../../assets/style/admin-prod-list.css';
import { Link } from 'react-router-dom';
import del from '../../assets/pictures/delete-black.png';
import edit from '../../assets/pictures/edit-black.png';

export default function AdminProductList() {

    const [adminProductsData, setAdminProductsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectValue, setSelectValue] = useState("order");
    const itemsPerPage = 8;

    /*     useEffect(() => {
            read('api/products')
                .then((res) => res.json())
    
                .then((obj) => {
                    console.log('Obj', obj);
    
                    setAdminProductsData(obj.products);
    
                });
    
        }, []) */

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, selectValue]);

    const fetchProducts = async (page) => {
        try {

            //TODO újra kell futtatni a queryt az új paramok szerint, mert a setSelectValue nem elég
            const orderBy = (selectValue && selectValue !== "order") ? selectValue.split("-")[0] : null;
            const order = (selectValue && selectValue !== "order") ? selectValue.split("-")[1] : null;
            console.log(orderBy, order, "rendezés");
            const res = await read(`api/products?page=${page}&orderBy=${orderBy}&order=${order}`);
            const obj = await res.json();
            console.log('Obj', obj);
            setAdminProductsData(obj.products);
        } catch (error) {
            console.error('Hiba történt a termékek lekérdezésekor.', error);
        }
    };

    console.log('adminProductsData', adminProductsData);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className="table-wrapper">
            <div className="select-option">
                <select value={selectValue} id="ordered-list" onChange={(e) => setSelectValue(e.target.value)} >
                    <option value="order">Rendezés</option>
                    <option value="title-asc">Név szerint növekvő</option>
                    <option value="title-desc">Név szerint csökkenő</option>
                    <option value="price-asc">Ár szerint növekvő</option>
                    <option value="price-desc">Ár szerint csökkenő</option>
                </select>
            </div>
            <div className="table-container">
                <table id='admin-product-list'>
                    <caption>
                        Termékek
                    </caption>
                    <tr>
                        <th>Cikkszám</th>
                        <th>Termék megnevezése</th>
                        <th>Ár</th>
                        <th>Módosítás</th>
                        <th>Törlés</th>
                    </tr>

                    {/* <div className="table-body"> */}
                    {
                        adminProductsData.map(product => (
                            <tr>
                                <AdminSingleProduct product={product} className='table-row' key={product.id} />
                                <td className='table-cells resp'><Link to={`/admin/termekek/modositas/${product.id}`} ><img className='edit' src={edit} alt='edit' style={{ width: '20px' }} /></Link></td>
                                <td className='table-cells resp'><Link to={`/admin/termekek/torles/${product.id}`} ><img className='del' src={del} alt='del' style={{ width: '20px' }} /></Link></td>
                            </tr>
                        )
                        )}
                    {/* </div> */}
                </table>


                {/* <div className="table-header">
        <div className="admintable-outer-container">
            <div className="select-option">
                <select value={selectValue} id="ordered-list" onChange={(e) => setSelectValue(e.target.value)} >
                    <option value="order">Rendezés</option>
                    <option value="title-asc">Név szerint növekvő</option>
                    <option value="title-desc">Név szerint csökkenő</option>
                    <option value="price-asc">Ár szerint növekvő</option>
                    <option value="price-desc">Ár szerint csökkenő</option>
                </select>
            </div>
            <div className="table-header">
                <div className="table-wrapper">
                    <div className="table-container">
                        <table id='admin-product-list'>
                            <caption>
                                Termékek
                            </caption>
                            <tr>
                                <th>Cikkszám</th>
                                <th>Termék megnevezése</th>
                                <th>Ár</th>
                                <th>Módosítás</th>
                                <th>Törlés</th>
                            </tr>

                            {/* <div className="table-body"> */}
                {/* {
                    adminProductsData.map(product => (
                        <tr>
                            <AdminSingleProduct product={product} className='table-row' key={product.id} />
                            <td className='table-cells resp'> <Link to={`/admin/termekek/modositas/${product.id}`} ><img className='edit' src={edit} alt='edit' style={{ width: '20px' }} /></Link></td>
                            <td className='table-cells resp'><Link to={`/admin/termekek/torles/${product.id}`} ><img className='del' src={del} alt='del' style={{ width: '20px' }} /></Link></td>
                        </tr>
                    )
                    )} */}
                {/* </div> */}
                <div className="pagination-buttons">
                    <button onClick={handlePrevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Vissza</button>
                    <br></br>
                    <button onClick={handleNextPage} className={adminProductsData && adminProductsData.length < itemsPerPage ? "disabled" : ""} disabled={adminProductsData && adminProductsData.length < itemsPerPage}>Előre</button>
                </div>
            </div>
        </div >
    )
}