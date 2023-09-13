import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

//Contexts:
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';
import { BillingAddress, OrderComment, ShippingAddress, OrderTotal, OrderCheckbox } from './context/OrderContext';
import { ToastContext } from './context/ToastContext';
import OrderErrorMessages, { ValidOrderForm, OrderShippingMessages } from "./context/OrderErrorMessages";


// Pages:
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetailsPage from './pages/user/ProductsDetailsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminProductDelete from './pages/admin/AdminProductDelete';
import RegistrationLogin from './pages/user/RegistrationLogin';
import Profile from './pages/user/Profile';
import Admin from './pages/admin/Admin';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategoryAdd from './pages/admin/AdminCategoryAdd';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryEditPage from './pages/admin/AdminCategoryEditPage';
import AdminCategoryDeletePage from './pages/admin/AdminCategoryDeletePage';
import AdminUsers from './pages/admin/AdminUsers';
import CartPage from './pages/user/CartPage';
import OrderPage from './pages/user/OrderPage';
import OrderConfirmPage from './pages/user/OrderConfirmPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetails from './components/admin/AdminOrderDetails';
import UserOrders from './components/user/UserOrders';
import UserOrdersProducts from './components/user/UserOrdersProducts';

// Components:
import Layout from './components/user/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Auth from './components/user/Auth';
import AdminUserDeletePage from './pages/admin/AdminUserDeletePage';
import AdminUserEditPage from './pages/admin/AdminUserEditPage';
import Cart from './components/user/Cart';
import UserEdit from './components/user/UserEdit';
import Login from './components/user/Login';
import { AdminAuthContext } from './context/AdminAuthContext';
import AdminAuth from './components/admin/AdminAuth';
import NotFoundRouter from './components/user/NotFoundRouter';


function App() {

  const [user, setUser] = useState({});
  const [cart, setCart] = useState({});
  const [billAddress, setBillAddress] = useState({});
  const [comment, setComment] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);
  const [message, setMessage] = useState({})
  const [valid, setValid] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
      surname: null, familyname: null, code: null, housenum: null, city: null, street: null,
    })
  const [shipErrorMessage, setShipErrorMessage] = useState({
    shipsurname: null, shipfamilyname: null, shipcode: null, shiphousenum: null, shipcity: null, shipstreet: null
  })

  const [cookies, setCookies, clearCookies] = useCookies(["sessionID"]);

  function toastTimer(message, success) {
    setMessage({message: message, success: success})
    setTimeout(()=> {
      setMessage({})
    }, 2000)
  }

  useEffect(() => {
    console.log(cookies, 'cookies');
    fetch("http://localhost:8000/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "applicaton/json"
      },
    })
      .then(resp => resp.json())
      .then(respBody => {
        setUser(respBody);
        console.log(respBody, "respbody");
      })
  }, []);


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/termekek', element: <Products /> },
        { path: '/termek/:id', element: <ProductDetailsPage /> },
        { path: '/auth/registration-login', element: <RegistrationLogin /> },
        // { path: '/auth/login', element: <Login /> },
        { path: "/auth/profile", element: <Auth><Profile /></Auth> },
        { path: "/auth/profile/modositas", element: <Auth><UserEdit /></Auth> },
        { path: "/auth/megrendelesek", element: <Auth><UserOrders /></Auth> },
        { path: "/auth/profile/megrendelesek/termekek/:id", element: <Auth><UserOrdersProducts /></Auth> },
        { path: "/kosar", element: <CartPage /> },
        { path: "/kosar/modositas/:id", element: <Cart /> },
        { path: "/megrendeles", element: <OrderPage /> },
        { path: "/megrendeles/osszesites", element: <OrderConfirmPage /> },
        { path: "*", element: <NotFoundRouter /> }

      ]
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      element: <AdminAuth><AdminLayout /></AdminAuth>,
      children: [
        { path: '/admin', element: <Admin /> },
        { path: '/admin/termekek-felvitel', element: <AdminProductAdd /> },
        { path: '/admin/termekek', element: <AdminProducts /> },
        { path: '/admin/termekek/modositas/:id', element: <AdminProductEditPage /> },
        { path: '/admin/termekek/torles/:id', element: <AdminProductDelete /> },
        { path: '/admin/kategoria-felvitel', element: <AdminCategoryAdd /> },
        { path: '/admin/kategoriak', element: <AdminCategories /> },
        { path: '/admin/kategoriak/modositas/:id', element: <AdminCategoryEditPage /> },
        { path: '/admin/kategoriak/torles/:id', element: <AdminCategoryDeletePage /> },
        { path: '/admin/felhasznalok/torles/:id', element: <AdminUserDeletePage /> },
        { path: '/admin/felhasznalok/modositas/:id', element: <AdminUserEditPage /> },
        { path: '/admin/felhasznalok/torles/:id', element: <AdminUserDeletePage /> },
        { path: '/admin/felhasznalok', element: <AdminUsers /> },
        { path: '/admin/megrendelesek', element: <AdminOrdersPage /> },
        { path: '/admin/megrendelesek/:id', element: <AdminOrderDetails /> }
      ]
    }

  ])

  return (
    <OrderShippingMessages.Provider value={[shipErrorMessage, setShipErrorMessage]}>
    <OrderCheckbox.Provider value={[sameAsBilling, setSameAsBilling]}>
    <ValidOrderForm.Provider value={[valid, setValid]}>
    <OrderErrorMessages.Provider value={[errorMessage, setErrorMessage]}>
    <ToastContext.Provider value={[message, setMessage, toastTimer]}>
      <AdminAuthContext.Provider value={[user, setUser]}>
        <AuthContext.Provider value={[user, setUser]}>
          <CartContext.Provider value={[cart, setCart]}>
            <OrderTotal.Provider value={[orderTotal, setOrderTotal]}>
              <BillingAddress.Provider value={[billAddress, setBillAddress]}>
                <OrderComment.Provider value={[comment, setComment]}>
                  <ShippingAddress.Provider value={[shippingAddress, setShippingAddress]}>
                    
                    <RouterProvider router={router} />
                    
                  </ShippingAddress.Provider>
                </OrderComment.Provider>
              </BillingAddress.Provider>
            </OrderTotal.Provider>
          </CartContext.Provider>
        </AuthContext.Provider>
      </AdminAuthContext.Provider>
    </ToastContext.Provider>
    </OrderErrorMessages.Provider>
    </ValidOrderForm.Provider>
    </OrderCheckbox.Provider>
    </OrderShippingMessages.Provider>
  );
}

export default App;
