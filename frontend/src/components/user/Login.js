// import { useContext, useState } from "react";
import { useContext, useReducer, useState } from "react"
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { ToastContext } from "../../context/ToastContext";
import { read } from "../../repositories/Crud";
import reducer from "../../utils/reducer.js";
import { useNavigate } from "react-router-dom"

import "../../assets/style/login.css"
import { validateLogin } from "../../utils/validationUtil.js";

let emailErrorHelper;
let passwordErrorHelper;
let loginErrorHelper;

export default function Login() {
    const initial = {
        email: "",
        emailError: null,
        password: "",
        passwordError: null,
        loginErrorFromBackend: null
    }
    const [state, dispatch] = useReducer(reducer, initial);

    // const [formData, setFormData] = useState({
    //     email: "",
    //     password: ""
    // });

    const [user, setUser] = useContext(AuthContext);
    const [cart, setCart] = useContext(CartContext);
    const [errorMessage, setErrorMessage] = useState({});
    const [message, setMessage, toastTimer] = useContext(ToastContext)
    const navigate = useNavigate();
    // const [cookies, setCookie] = useCookies(["sessionID"]);
    // const [errorMessage, setErrorMessage] = useState({});
    console.log(cart, 'cart');

    return (
        <div className="login-form">
            <h1>Bejelentkezés</h1>
            {state.loginErrorFromBackend &&
                <p>
                    {state.loginErrorFromBackend}
                </p>
            }
            <form>
                <p className="log-text">
                    <input className="effect-1" type="email"
                        // value={formData.email}
                        value={state.email}
                        onChange={e => dispatch({ type: "email", email: e.target.value })}
                        required
                    // required onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span className="focus-border"></span>
                    <label htmlFor="email"> E-mail: </label>
                </p>
                {/* {errorMessage.email &&
                    <p>
                        {errorMessage.email}
                    </p>
                }  */}
                {state.emailError &&
                    <p>
                        {state.emailError}
                    </p>
                }
                <p className="log-text">
                    <input className="effect-1" type="password"
                        // value={formData.password}
                        value={state.password}
                        // required minLength={6} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onChange={e => dispatch({ type: "password", password: e.target.value })}
                        required
                    />
                    <span class="focus-border"></span>
                    <label htmlFor="password"> Jelszó: </label>
                </p>
                {/*errorMessage.password &&
                    <p>
                        {errorMessage.password}
                    </p>
            */
                    state.passwordError &&
                    <p>
                        {state.passwordError}
                    </p>}
                <p>
                    <button className="log-btn" type="submit" onClick={(e) => login(e)}>Belépés</button>
                </p>
            </form>
        </div >
    )

    async function login(e) {
        dispatch({ type: 'emailError', emailError: null })
        dispatch({ type: 'passwordError', passwordError: null })
        dispatch({ type: 'loginErrorFromBackend', loginErrorFromBackend: null })

        e.preventDefault();
        let hasError = false;

        if (!validateLogin(state.email)) {
            console.log("Belépési hiba");
            // setErrorMessage({ ...errorMessage, email: "Ezt a mezőt kötelező kitölteni!" });
            dispatch({ type: 'emailError', emailError: "Kötelezően kitöltendő mező!" })
            hasError = true;

        }
        if (!validateLogin(state.password)) {
            console.log("Belépési hiba");
            // setErrorMessage({ ...errorMessage, password: "Ezt a mezőt kötelező kitölteni!" });
            dispatch({ type: 'passwordError', passwordError: "Kötelezően kitöltendő mező!" })
            hasError = true;
        }
        emailErrorHelper = state.emailError;
        passwordErrorHelper = state.passwordError;
        if (hasError) {
            return;
        }
        const resp = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state),
            credentials: "include"
        })
        if(!resp.ok) {
            toastTimer("Sikertelen bejelentkezés!", false)
        }
        const data = await resp.json();
        if (data.error) {
            console.log(data);
            console.log(data.error)
            if (data.error !== null) {
                dispatch({ type: 'loginErrorHelper', loginError: `${data.error}` })
                hasError = true;
                // dispatch({ type: 'loginErrorFromBackend', loginErrorFromBackend: "valami    !" })
                loginErrorHelper = state.loginError;
                //valami változó ami jelzi, hogy nem sikerült a backenden a login
                return;
            }
        }
        if (data.isAdmin) {
            setUser(data)
            navigate('/admin')
        }
        else {
            setUser(data)
            read('api/cart')
                .then(resp => resp.json())
                .then(cartitems => setCart(cartitems))
            navigate('/')
        }
        // // .then(resp => resp.json())
        // // .then(respBody => {
        // //     console.log(respBody);
        // //     if (respBody.error) alert("error")
        // //     else if (respBody.isAdmin) {
        // //         console.log("admin");
        // //         navigate('/admin')
        // //     } else if (!respBody.isAdmin) {
        // //         console.log("user");
        // //         setUser(respBody);
        // //         read('api/cart')
        // //             .then(resp => resp.json())
        // //             .then(cartitems => console.log(cartitems, "loginból"))
        // //     }           
        // })
        // .then(resp => {
        //     return resp.json();
        // })
        // .then(respBody => {
        //     console.log(respBody);
        //     console.log(respBody.error)
        //     if (respBody.error !== null) {
        //         dispatch({ type: 'loginErrorHelper', loginError: `${respBody.error}` })
        //         hasError = true;
        //         // dispatch({ type: 'loginErrorFromBackend', loginErrorFromBackend: "valami    !" })
        //         loginErrorHelper = state.loginError;
        //         //valami változó ami jelzi, hogy nem sikerült a backenden a login
        //         return;
        //     }
        //     else {
        //         setUser(respBody);
        //         /* setCookie("sessionID", respBody.sessionID); */
        //         read('api/cart')
        //             .then(resp => resp.json())
        //             .then(cartitems => console.log(cartitems, "loginból"))
        //     }
        // })/* .then(loginError => {
        //     console.log(loginError)
        //         loginErrorHelper = loginError;
        //         dispatch({ type: 'loginErrorFromBackend', loginErrorFromBackend: loginError})
        // }) */

    }
}