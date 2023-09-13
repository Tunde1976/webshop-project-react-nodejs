import { useContext, useEffect, useState } from "react"
import { read } from "../../repositories/Crud";
import { AuthContext } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom";
import '../../assets/style/user-edit.css';
import '../../assets/style/order-form.css';
import '../../assets/style/user-order-details.css';
import '../../assets/style/order-confirm.css';
import '../../assets/style/userprofile.css';


export default function Profile() {
    const [user, setUser] = useContext(AuthContext);
    const [details, setDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetchUserDetails(user.localID)

    }, [user.localID]);

    console.log(details, "details");

    const fetchUserDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/userdetails/${id}`)

            if (!response.ok) {
                throw new Error('Hiba a szerver válaszában.');
            }

            const data = await response.json();
            if (!data || !data.data) {
                throw new Error('Üres válasz vagy hiányzó adatok.');
            }

            setDetails(data?.data); // Az adatokat elmentjük a details state-be
        } catch (error) {
            console.error('Hiba történt a felhasználói adatok lekérdezésekor.', error);
        }
    };

    return (
        <>
            <div className="user-edit">
                <div className="user-data-edit">
                    <h2 className="user-edit-h2">Köszöntünk az oldalunkon, {details.billing_surname}! Jó vásárlást!</h2>


                    <div className="user-data">
                        <div className="foreground">
                            <div className="user-data-box">
                                <div className="details-img-cont">
                                    <div>
                                        <img src="https://images.pexels.com/photos/7067192/pexels-photo-7067192.jpeg?auto=compress&cs=tinysrgb&w=600" />
                                    </div>
                                    <div className="orderForm--fields-content">
                                        <h2 className="user-edit-h2">Adataim</h2>

                                        <div>
                                            <label htmlFor="billing_familyname">Név</label>
                                            <p>{details ? [details.billing_familyname, " ", details.billing_surname] : "Még nem adtad meg ezt az információt"}</p>
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email</label>
                                            <p>{user.email}</p>
                                        </div>

                                        <div>
                                            <label htmlFor="shipping_postal_code">Szállítási cím</label>
                                            <p>{details ? [details.shipping_postal_code, " ", details.shipping_city, ", ", details.shipping_street, " utca ", details.shipping_house_number, "."] : "Még nem állítottál be címet"}</p>
                                        </div>

                                        <div>
                                            <label htmlFor="billing_postal_code">Számlázási cím</label>
                                            <p>{details ? [details.billing_postal_code, " ", details.billing_city, ", ", details.billing_street, " utca ", details.billing_house_number, "."] : "Még nem állítottál be címet"}</p>
                                        </div>

                                        <div className="data-edit-link"><Link to={`/auth/profile/modositas/`}>Adatmódosítás</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}