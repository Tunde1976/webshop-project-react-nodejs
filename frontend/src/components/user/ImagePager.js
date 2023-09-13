import { useState } from "react";
import "../../assets/style/image-pager.css"
export default function ImagePager(props) {

    const [actualPage, setActualPage] = useState(1);

    function nextButton() {
        if (actualPage === props.images.length - 1) setActualPage(0);
        else setActualPage(actualPage + 1);
    }

    function prevButton() {
        if (actualPage === 0) setActualPage(props.images.length - 1);
        else setActualPage(actualPage - 1);
    }

    return (

        <div className="slideshow-container ">

            {/* <div className="mySlides-fade"> */}
                {/* <div className="numbertext">1 / 3</div> */}
                <div className="img-div">
                    <img
                        src={props.images[actualPage].url}
                        alt={props.images[actualPage].title}
                    />

                </div>

                <button className="prev-btn" onClick={prevButton}>{"<"}</button>
                <button className="next-btn" onClick={nextButton}>{">"}</button>

                <div className="text">
                    <h1>{props.images[actualPage].title}</h1>
                    <span>{props.images[actualPage].description[0]}</span>
                </div>
                <div className="text-two">
                    {/* <h1>{props.images[actualPage].title}</h1> */}
                    <span>{props.images[actualPage].description[1]}</span>
                </div>

                <div className="dot-container">
                    {props.images.map((image, index) => (
                        <div
                            className={index === actualPage ? "circle active" : "circle"}
                            onClick={() => setActualPage(index)}
                        >
                        </div>
                    ))}
                </div>

            {/* </div> */}

        </div>
    )
}