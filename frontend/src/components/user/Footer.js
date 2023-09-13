//import { Link } from "react-router-dom";
import '../../assets/style/footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {

    return (
        <footer className="footer-container">
            <div className="container">
                <div className="row">
                    <div className="footer-col">
                        <h4 className="line">Rólunk</h4>
                        <ul>
                            <li><a href="/about">rólunk</a></li>
                            <li><a href="#">impresszum</a></li>
                            <li><a href="#">adatvédelmi nyilatkozat</a></li>
                            <li><a href="#">kapcsolat</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4 className="line">online bolt</h4>
                        <ul>
                            <li><a href="#">fizetési módok</a></li>
                            <li><a href="#">szállítási információk</a></li>
                            <li><a href="#">GYIK</a></li>
                            <li><a href="#">információk</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4 className="line">Kövess minket</h4>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i><FaFacebookF /></a>
                            <a href="#"><i className="fab fa-twitter"></i><FaInstagram /></a>
                            <a href="#"><i className="fab fa-instagram"></i><FaTwitter /></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i><FaYoutube /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}