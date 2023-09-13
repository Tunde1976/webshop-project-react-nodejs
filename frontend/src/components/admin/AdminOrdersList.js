import React, { useEffect, useState } from 'react';
import { read } from '../../repositories/Crud';
import AdminSingleOrder from './AdminSingleOrder';
//import { v4 as uuidv4 } from 'uuid';
import '../../assets/style/admin-orders-table.css';
import { Link } from 'react-router-dom';

export default function AdminOrdersList() {

    const [adminOrdersData, setAdminOrdersData] = useState([]);

    useEffect(() => {
        read('api/orders')
            .then((res) => res.json())

            .then((obj) => {
                console.log('Obj', obj);

                setAdminOrdersData(obj.data);
            });

    }, [])

    console.log('adminOrdersData:', adminOrdersData);


    return (
        <div className="order-table-wrapper">
            <div className='order-table-container'>
                <table className='order-table'>
                    <caption className='order-table-caption'>
                        Megrendelések
                    </caption>
                    <tr className='ot-tr'>
                        <th className='ot-th'>Azonosító</th>
                        <th className='ot-th'>Dátum</th>
                        <th className='ot-th'>Státusz</th>
                        <th className='ot-th'>Részletek</th>
                    </tr>

                    {
                        adminOrdersData.map(order => (
                            <tr className='ot-tr'>
                                {/* <div className="table-row" key={order.order_id}> */}
                                <AdminSingleOrder order={order} className="table-row" key={order.order_id} />
                                <td className='ot-cell'> <Link to={`/admin/megrendelesek/${order.order_id}`}><p className='edit'>Részletek</p></Link></td>
                                {/* </div> */}
                            </tr>
                        )
                        )}
                </table>
            </div>
        </div>

    )
}