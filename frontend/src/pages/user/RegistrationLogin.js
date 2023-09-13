import Registration from "../../components/user/Registration";
import Login from "../../components/user/Login";
import "../../assets/style/registration-login.css";

export default function RegistrationLogin() {
    return (
        <>
            <div class="instructions">
                Oldalunkon lehetőséged van egyszerűen és gyorsan regisztrálni, vagy bejelentkezni, ha már regisztrált felhasználónk vagy.
            </div>
            <div class="wrapper">
                <div class="registration">
                    Ha még nem regisztráltál nálunk, válaszd a "Regisztráció" opciót, és add meg a szükséges információkat az űrlapon. A sikeres regisztrációt követően már be is tudsz jelentkezni új fiókoddal.
                </div>
                <div class="login">
                    Amennyiben már rendelkezel regisztrált felhasználói fiókkal, csak add meg az e-mail címed és jelszavad a "Bejelentkezés" szekcióban, hogy elérhesd személyre szabott tartalmainkat.
                </div>
            </div>
            <div className="registration-login-form">
                <Registration />
                <Login />

            </div>
        </>
    )
}