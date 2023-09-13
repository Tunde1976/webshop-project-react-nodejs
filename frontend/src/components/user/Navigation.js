import '../../assets/style/nav.css'
import logo from '../../assets/pictures/logo.png'
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { BillingAddress, ShippingAddress } from '../../context/OrderContext';

export default function Navigation() {

    const [user, setUser] = useContext(AuthContext);
    const [cart, setCart] = useContext(CartContext);
    const [billAddress, setBillAddress] = useContext(BillingAddress);
    const [shippingAddress, setShippingAddress] = useContext(ShippingAddress);
    const navigate = useNavigate();
    // const navclass = 'scrolled';
    // const [scrolled, setScrolled] = useState(false);
    // const [y, setY] = useState(0);

    // useEffect(() => {
    //     if(window.scrollY > 0) {
    //         setY(window.scrollY)
    //         setScrolled(true)
    //     } 
    //     console.log(window.scrollY, "scroll");
    // }, [window.scrollY])

    // useEffect(() => {
    //     if (user.email) navigate("auth/profile");
    //     // else {
    //     //     navigate("/");
    //     // }
    // }, [user]);

    return (
        <div className={`nav--container`}>
            <div className='navbar'>

                <div> <NavLink to='/' ><img className='logo' src={logo} alt='logo' style={{ width: '60px' }} /></NavLink> </div>
                {!user.isAdmin == true ?
                    null
                    :
                    <div> <NavLink className={({ isActive }) => isActive ? "nav-link active-nav" : "nav-link"} to='/admin'>Admin</NavLink> </div>
                }
                <div> <NavLink to='/termekek' className={({ isActive }) => isActive ? "nav-link active-nav" : "nav-link"}>Termékek</NavLink> </div>
                <div> <NavLink to='/kosar' className={({ isActive }) => isActive ? "active-nav" : ""}>Kosár</NavLink></div>
                {user.email ?
                    null
                    :
                    <div> <NavLink to='/auth/registration-login' className={({ isActive }) => isActive ? "active-nav" : ""}>Regisztráció | Bejelentkezés</NavLink> </div>
                }
                {!user.email ?
                    null
                    :
                    <div> <NavLink to='/auth/profile' className={({ isActive }) => isActive ? "active-nav" : ""}>Profilom</NavLink> </div>
                }
                {!user.email ?
                    null
                    :
                    <div> <NavLink to='/auth/megrendelesek' className={({ isActive }) => isActive ? "active-nav" : ""}>Megrendeléseim</NavLink> </div>
                }
                {user.email ?
                    <a href="#" onClick={logout}>Kijelentkezés</a>
                    :
                    null
                }
            </div>

            {/* <input id="menu-toggle" type="checkbox" />
            <label class='menu-button-container' for="menu-toggle">
                <div class='menu-button'></div>
            </label> */}

        </div>
    );

    function logout() {
        fetch(`http://localhost:8000/logout`, {
            credentials: "include"
        })
            .then(resp => resp.text())
            .then(() => {
                setUser({});
                setCart({});
                setBillAddress({});
                setShippingAddress({});
                navigate('/')
            });
    }
}