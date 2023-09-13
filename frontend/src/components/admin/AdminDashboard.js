import { useEffect, useState } from 'react';
import { read } from '../../repositories/Crud';
import '../../assets/style/admin-dashboard.css';
import {LiaCookieSolid} from "react-icons/lia";
import {LiaUsersSolid} from "react-icons/lia";
import {LiaMoneyCheckAltSolid} from "react-icons/lia";


export default function AdminDashboard() {

    const [productsAmount, setProductsAmount] = useState(0);
    const [usersAmount, setUsersAmount] = useState(0);
    const [ordersAmount, setOrdersAmount] = useState(0);

    console.log("OrdersAmount:", ordersAmount)
    console.log("usersAmount:", usersAmount)
    console.log("ProductsAmount:", productsAmount)


    useEffect(() => {

        read('api/users')
            .then((resp) => resp.json())
            .then((obj) => {
                console.log(obj, "error");
                setUsersAmount(Object.values(obj.users).length)

            })

        read('api/orders')
            .then((res) => res.json())
            .then((obj) => {
                setOrdersAmount(Object.values(obj.data).length)

            })

        read('api/productscount')
            .then((res) => res.json())
            .then((obj) => {
                setProductsAmount(Object.values(obj.data).length)

            })
    }, [])



    return (
        <>

            <div className='admin-dashboard--title'>
            <h1>Webshop statisztika</h1>
            </div>
            <div className="stat--container">

                <div className="stat--card">
                    <div className="stat--data">
                        <p className="stat--count">{productsAmount}</p>
                        <p className="stat--title"> termék </p>
                    </div>
                    <div className="stat--icon"><LiaCookieSolid/> </div>
                </div>

                <div className="stat--card">
                    <div className="stat--data">
                        <p className="stat--count">{usersAmount}</p>
                        <p className="stat--title"> felhasználó </p>
                    </div>
                    <div className="stat--icon"> <LiaUsersSolid/> </div>
                </div>

                <div className="stat--card">
                    <div className="stat--data">
                        <p className="stat--count">{ordersAmount}</p>
                        <p className="stat--title"> megrendelés </p>
                    </div>
                    <div className="stat--icon"> <LiaMoneyCheckAltSolid/> </div>
                </div>





            </div>



        </>
    )

}