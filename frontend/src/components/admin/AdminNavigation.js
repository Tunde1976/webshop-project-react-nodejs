import { NavLink } from "react-router-dom";
import '../../assets/style/nav.css';

export default function AdminNavigation() {
    return (

        <div className="admin-nav--container">
            <div className="navbar">
                <div><NavLink to='/' className={({isActive}) => isActive ? "active-nav" : ""}>Home</NavLink></div>
                <div><NavLink to='/admin/termekek' className={({isActive}) => isActive ? "active-nav" : ""}>Terméklista</NavLink></div>
                <div><NavLink to='/admin/termekek-felvitel' className={({isActive}) => isActive ? "active-nav" : ""}>Termékfelvitel</NavLink></div>
                <div><NavLink to='/admin/kategoriak' className={({isActive}) => isActive ? "active-nav" : ""}>Kategóriák</NavLink></div>
                <div><NavLink to='/admin/kategoria-felvitel' className={({isActive}) => isActive ? "active-nav" : ""}>Kategória felvitel</NavLink></div>
                <div><NavLink to='/admin/felhasznalok' className={({isActive}) => isActive ? "active-nav" : ""}>Felhasználók</NavLink></div>
                <div><NavLink to='/admin/megrendelesek' className={({isActive}) => isActive ? "active-nav" : ""}>Megrendelések</NavLink></div>
            </div>
        </div>
    )
}