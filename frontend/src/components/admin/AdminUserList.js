import React, { useEffect, useState } from 'react';
import { read } from '../../repositories/Crud';
import AdminSingleUser from './AdminSingleUser';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import '../../assets/style/admin-users-table.css';
import del from '../../assets/pictures/delete-black.png';
import edit from '../../assets/pictures/edit-black.png';

export default function AdminUserList() {

    const [adminUsersData, setAdminUsersData] = useState([]);
    const [totalPages, setTotalPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectValue, setSelectValue] = useState("order");
    const itemsPerPage = 8;

    useEffect(() => {
        read('api/users')
            .then((resp) => resp.json())

            .then((obj) => {
                console.log('Obj', obj);
                setAdminUsersData(obj.users);
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
            const res = await read(`api/users?page=${page}&orderBy=${orderBy}&order=${order}`);
            const obj = await res.json();
            console.log('Obj', obj);
            setAdminUsersData(obj.users);
            setTotalPages(obj.totalPages);
        } catch (error) {
            console.error('Hiba történt a termékek lekérdezésekor.', error);
        }
    };

    console.log('adminUsersData', adminUsersData);

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
                    <option value="email-asc">Név szerint növekvő</option>
                    <option value="email-desc">Név szerint csökkenő</option>
                    <option value="id-asc">ID szerint növekvő</option>
                    <option value="id-desc">ID szerint csökkenő</option>
                </select>
            </div>
            <div className="table-wrapper">
                <div className="table-container">
                    <table>
                        <caption>
                            Felhasználók
                        </caption>
                        <tr>
                            <th>Felhasználói azonosító</th>
                            <th>Email cím</th>
                            <th>Módosítás</th>
                            <th>Törlés</th>
                        </tr>

                        {
                            adminUsersData.map(user => (
                                <tr>
                                    {/* <div className="table-row" key={uuidv4()}> */}
                                    <AdminSingleUser className="table-row" key={uuidv4()} user={user} />
                                    <td><Link to={`/admin/felhasznalok/modositas/${user.id}`}><img className='edit' src={edit} alt='edit' style={{ width: '20px' }} /></Link></td>
                                    <td><Link to={`/admin/felhasznalok/torles/${user.id}`}><img className='del' src={del} alt='del' style={{ width: '20px' }} /></Link></td>
                                    {/* </div> */}
                                </tr>
                            )
                            )}
                    </table>
                    <div className="pagination-buttons">
                        <button onClick={handlePrevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Vissza</button>
                        <br></br>
                        <button onClick={handleNextPage} className={adminUsersData && currentPage >= totalPages ? "disabled" : ""} disabled={adminUsersData && currentPage >= totalPages}>Előre</button>
                    </div>
                </div>
            </div >
        </div>
    )
}