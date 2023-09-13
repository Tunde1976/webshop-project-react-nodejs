import { useContext, useEffect, useState } from "react";
import { read, update } from "../../repositories/Crud";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import '../../assets/style/user-edit.css';
import '../../assets/style/order-form.css';
import '../../assets/style/user-order-details.css';
import '../../assets/style/order-confirm.css';

export default function UserEdit() {
    const [user, setUser] = useContext(AuthContext);
    const [details, setDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails(user.localID);
    }, [user.localID]);

    const fetchUserDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/userdetails/${id}`);

            if (!response.ok) {
                throw new Error('Hiba a szerver válaszában.');
            }

            const data = await response.json();
            if (!data || !data.data) {
                throw new Error('Üres válasz vagy hiányzó adatok.');
            }

            setDetails(data?.data);
        } catch (error) {
            console.error('Hiba történt a felhasználói adatok lekérdezésekor.', error);
        }
    };

    function handleChange(event) {
        const { name, value } = event.target;
        setDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    function userUpdate(e) {
        e.preventDefault();
        console.log(details);
        update(details, `api/userdetails/${user.localID}`)
            .then(res => res.json())
            .then((data) => {
                navigate('/auth/profile');
            });
    }

    return (
        <>
            <div className="user-edit">
                <div className="user-data-edit">
                    <h2 className="user-edit-h2">Módosítás</h2>

                    <div className='user-profile-edit-content'>
                        <h2 className="user-edit-h2-smaller">Név</h2>
                        <div>
                            <label htmlFor="billing_familyname">Vezetéknév</label>
                            <input
                                type="text"
                                defaultValue={details.billing_familyname}
                                placeholder={details.billing_familyname}
                                onChange={e => setDetails({ ...details, billing_familyname: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_surname">Keresztnév</label>
                            <input
                                type="text"
                                defaultValue={details.billing_surname}
                                placeholder={details.billing_surname}
                                onChange={e => setDetails({ ...details, billing_surname: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text" defaultValue={user.email}
                                placeholder={user.email}
                                onChange={e => setUser({ ...user, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Jelszó</label>
                            <input
                                type="password"
                                defaultValue={details.password}
                                placeholder={details.password}
                                onChange={e => setUser({ ...user, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='user-profile-edit-content'>
                        <h2 className="user-edit-h2-smaller">Szállítási cím</h2>
                        <div>
                            <label htmlFor="shipping_postal_code">Irányítószám</label>
                            <input
                                type="text"
                                defaultValue={details.shipping_postal_code}
                                placeholder={details.shipping_postal_code}
                                onChange={e => setDetails({ ...details, shipping_postal_code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="shipping_city">Város</label>
                            <input
                                type="text"
                                defaultValue={details.shipping_city}
                                placeholder={details.shipping_city}
                                onChange={e => setDetails({ ...details, shipping_city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="shipping_street">Utca</label>
                            <input
                                type="text"
                                defaultValue={details.shipping_street}
                                placeholder={details.shipping_street}
                                onChange={e => setDetails({ ...details, shipping_street: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="shipping_house_number">Házszám</label>
                            <input
                                type="text"
                                defaultValue={details.shipping_house_number}
                                placeholder={details.shipping_house_number}
                                onChange={e => setDetails({ ...details, shipping_house_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='user-profile-edit-content'>
                        <h2 className="user-edit-h2-smaller">Számlázási cím</h2>
                        <div>
                            <label htmlFor="billing_postal_code">Irányítószám</label>
                            <input y
                                type="text"
                                defaultValue={details.billing_postal_code}
                                placeholder={details.billing_postal_code}
                                onChange={e => setDetails({ ...details, billing_postal_code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_city">Város</label>
                            <input
                                type="text"
                                defaultValue={details.billing_city}
                                placeholder={details.billing_billing_city}
                                onChange={e => setDetails({ ...details, billing_city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_street">Utca</label>
                            <input
                                type="text"
                                defaultValue={details.billing_street}
                                placeholder={details.billing_street}
                                onChange={e => setDetails({ ...details, billing_street: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="billing_house_number">Házszám</label>
                            <input
                                type="text"
                                defaultValue={details.billing_house_number}
                                placeholder={details.billing_house_number}
                                onChange={e => setDetails({ ...details, billing_house_number: e.target.value })}
                            />
                        </div>
                    </div>


                    <div className='user-confirm-container'>
                        <div>
                            <div >
                                <button className="user-confirm" onClick={(e) => userUpdate(e)}> Módosítás</button>
                            </div>
                            <div>
                                <button className="user-confirm" onClick={() => navigate('/auth/profile')}> Mégsem</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}