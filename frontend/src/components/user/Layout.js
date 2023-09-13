import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import '../../assets/style/layout-styles.css';
import Toast from "../Toast";
import { useContext } from "react";
import { ToastContext } from "../../context/ToastContext";

export  default function Layout () {

    const [message, setMessage] = useContext(ToastContext)

    return (

        <div>
            <Navigation />
            {
                message.message && (
                        <Toast />
                )
            }
            <main className = "layout--main" >
                <Outlet/>
            </main>
            <Footer className = "footer-container"/>
        </div>
    )
}