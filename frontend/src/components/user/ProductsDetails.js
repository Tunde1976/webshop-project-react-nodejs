import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { read } from '../../repositories/Crud';
import SingleProductDetails from './SingleProductDetails';


export default function ProductsDetails() {

    const pathParameters = useParams();
    console.log(pathParameters.id);

    const [product, setProduct] = useState({});
    console.log("product:", product)

    useEffect(() => {

        read(`api/product/${pathParameters.id}`)
            .then((res) => res.json())
            .then((json) => setProduct(json.data));
            console.log("product:", product)

    }, []);

    return(
        <>
            <SingleProductDetails product={product}/>               
        </>
    )
}
