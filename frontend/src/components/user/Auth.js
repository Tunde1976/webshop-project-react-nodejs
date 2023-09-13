import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Auth(props) {

    const [user] = useContext(AuthContext);
    console.log(user, "useer");
    if (user.message) return <Navigate to="/auth/registration-login" />
    return props.children;
}