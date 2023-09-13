import {Outlet} from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import Footer from '../user/Footer';
import '../../assets/style/admin-layout-styles.css';
import { useContext } from 'react';
import { ToastContext } from '../../context/ToastContext';
import Toast from '../Toast';

export default function AdminLayout () {

    const [message, setMessage] = useContext(ToastContext)

    console.log(message, "message");

    return (

        <>
        <AdminNavigation/>
        {
                message.message && (
                    <div className="toast-message">
                        <Toast />
                    </div>
                )
        }
        <main className = "admin-layout--main">
            <Outlet/>
        </main>
        {/* <Footer/> */}
        
        </>

    )
}