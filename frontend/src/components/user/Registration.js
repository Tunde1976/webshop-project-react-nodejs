import { useReducer, useContext } from "react"
import { ToastContext } from "../../context/ToastContext"
import { validateNotEmpty, validateEmail, validatePassword } from "../../utils/validationUtil.js";
import "../../assets/style/registration-login.css";
import "../../assets/style/registration.css";
import reducer from "../../utils/reducer.js";

let emailErrorHelper;
let passwordErrorHelper;

export default function Registration() {
    const initial = {
        email: "",
        emailError: null,
        password: "",
        passwordError: null
    }
    // const [formData, setFormData] = useState({
    //     email: "",
    //     email: null,
    //     password: "",
    //     passwordError: null
    // });
    const [state, dispatch] = useReducer(reducer, initial);

    const [message, setMessage, toastTimer] = useContext(ToastContext)

    // const [errorMessage, setErrorMessage] = useReducer({reducer

    // });

    // console.log("INIT")
    // console.log("state: " + state.email)
    
    return (
        <div className="registration-form">
            <h1>Regisztráció</h1>
            <form>
                <p className="reg-text">
                    <input className="effect-1"
                        type="text"
                        value={state.email}
                        pattern="[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)"
                        title="Kötelezően kitöltendő!"
                        //    onChange={e => setFormData({ ...formData, email: e.target.value })}
                        onChange={e => dispatch({ type: "email", email: e.target.value })}

                        required
                    />
                    <span class="focus-border"></span>
                    <label> Email: </label>
                </p>
                {state.emailError &&
                    <p>
                        {state.emailError}
                    </p>
                }
                <p className="reg-text">
                    <input className="effect-1"
                        type="password"
                        value={state.password}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                        title="Tartalmaznia kell legalább egy számot, egy kis- és nagybetűt, és legalább 6 karakter hosszúnak kell lennie."
                        // onChange={e => setFormData({ ...formData, password: e.target.value })}
                        onChange={e => dispatch({ type: "password", password: e.target.value })}

                        required
                    />
                    <span class="focus-border"></span>
                    <label> Jelszó: </label>

                </p>
                {state.passwordError &&
                    <p>
                        {state.passwordError}
                    </p>
                }
              
                    <button className="reg-btn"
                        type="submit"
                        onClick={register}>Küldés</button>
               
            </form>
        </div>
    )

    function register(e) {
        e.preventDefault();
        console.log('REGISTER')
        dispatch({ type: 'emailError', emailError: null })
        dispatch({ type: 'passwordError', passwordError: null })

        // console.log(formData);
        let hasError = false;
        // if (!validateNotEmpty(formData.email)) {
        if (!validateNotEmpty(state.email)) {
            console.log("Regisztrációs hiba");
            // setEmailError("Kötelezően kitöltendő!");
            console.log(state.email)
            dispatch({ type: 'emailError', emailError: "Kötelezően kitöltendő mező!" })
            hasError = true;
            console.log(state.email)
        }
        // else if (!validateEmail(formData.email)) {
        else if (!validateEmail(state.email)) {

            console.log("Regisztrációs hiba");
            dispatch({ type: 'emailError', emailError: "Helytelen formátum!" })
            // setEmailError("Helytelen formátum!");
            hasError = true;
        }
        // if (!validateNotEmpty(formData.password)) {
        if (!validateNotEmpty(state.password)) {

            console.log("Regisztrációs hiba");
            // setPasswordError("Kötelezően kitöltendő!");
            dispatch({ type: 'passwordError', passwordError: "Kötelezően kitöltendő mező!" })
            hasError = true;
        }
        // else if (!validatePassword(formData.password)) {
        else if (!validatePassword(state.password)) {

            console.log("Regisztrációs hiba");
            dispatch({ type: 'passwordError', passwordError: "Tartalmaznia kell: Min. 6 karakter, kis- és nagybetű, szám" })
            // setPasswordError("Tartalmaznia kell: Min. 6 karakter, kis- és nagybetű, szám");
            hasError = true;
        }
        console.log(state);

        /* 
        const fd = new FormData();
        fd.append("email", formData.email);
        fd.append("password", formData.password); */
        /*         console.log(fd.password); */
        emailErrorHelper = state.emailError;
        passwordErrorHelper = state.passwordError;
        if (hasError) {
            return;
        }
        console.log("NO ERROR")

        fetch("http://localhost:8000/auth/register", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(state)
        })
            .then(resp => resp.text())
            .then(respBody => console.log(respBody))
            .then(() => {
                toastTimer("Sikeres regisztráció!", true)
                dispatch({ type: "password", password: "" })
                dispatch({ type: "email", email: "" })
        });
    }

    // function setEmailError(value) {
    //     setErrorMessage(existingValues => ({
    //         ...existingValues,
    //         email: value
    //     }))
    // }
    // function setPasswordError(value) {
    //     setErrorMessage(existingValues => ({
    //         ...existingValues,
    //         password: value
    //     }))
    // }

}