import React from 'react';
import styled from "styled-components"
import '../../assets/style/home.css';
import { FaShoppingCart } from "react-icons/fa";
import ImagePager from '../../components/user/ImagePager';
import { Link } from 'react-router-dom';

export default function Home() {

  const images = [
    { url: 'https://images.pexels.com/photos/12486779/pexels-photo-12486779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      title: 'RENDELJ MOST', 
      description: ['15 000 Ft felett ingyenes házhozszállítás*' , '*2023.08.01-08.31']
    },
    { url: 
      'https://images.pexels.com/photos/3776939/pexels-photo-3776939.jpeg', 
      title: 'Special box', 
      description: ['Keresd a kosárban!' , 'rendelj most és lepd meg magad nyári különlegességünkkel']
    },
    { url: 
      'https://images.pexels.com/photos/7474246/pexels-photo-7474246.jpeg', 
      title: 'Ne hagyd ki', 
      description: ['Szezonális újdonságok', 'ne hagyd ki, rendeld meg most']
    },
  ];

  
  const ProductCard = styled.div`
  &:hover {
  background-color: grey
}
`;

  return (
    <div className="main-content">

      <>
        <ImagePager images={images} selected={1} />
      </>


      <div className="product-grid parallax">

        <div className='special-product right'>          
        <Link to="/termek/Y2drg0XRtU">
            <img src='https://images.pexels.com/photos/2014693/pexels-photo-2014693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'/>
            <div className='main-product-data'>scnickers</div>
            <div class="overlay"></div>
        </Link>
        </div>
        <svg viewBox="0 0 200 40">
          <text x="20" y="25" class="small">nyári</text>
          <text x="55" y="40" class="medium">újdonságok</text>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" className="home-svg">
              <defs>
                <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255, 231.447, 220.299, 1)"></stop>
                  <stop offset="100%" stopColor="rgba(255, 179.286, 159.969, 1)"></stop>
                </linearGradient>
                
              </defs>
              <path
                fill="url(#sw-gradient)"
                strokeWidth="0"
                d="M23.5-26.8c7 4.6 12.6 12 14 20.2 1.4 8.1-1.4 16.9-6.7 22.8-5.2 5.9-12.9 8.8-20.8 12-7.8 3.2-15.9 6.6-24.2 5.8-8.3-.9-17-6-22.4-13.7-5.4-7.7-7.7-18.1-4.5-26.1 3.1-7.9 11.7-13.5 19.5-18 7.7-4.4 14.7-7.8 22.3-8.6 7.6-.8 15.9 1 22.8 5.6z"
                transform="translate(50 50)"
                style={{
                  WebkitTransition: "all 0.3s ease 0s",
                  transition: "all 0.3s ease 0s",
                }}
              >
              </path>

              <text x="35" y="58" fill="white" class="small">édes</text>
          </svg>

      </div>


      <div className="product-grid parallax">

          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" className="home-svg">
              <defs>
                <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255, 231.447, 220.299, 1)"></stop>
                  <stop offset="100%" stopColor="rgba(255, 179.286, 159.969, 1)"></stop>
                </linearGradient>
                
              </defs>
              <path
                fill="url(#sw-gradient)"
                strokeWidth="0"
                d="M23.5-26.8c7 4.6 12.6 12 14 20.2 1.4 8.1-1.4 16.9-6.7 22.8-5.2 5.9-12.9 8.8-20.8 12-7.8 3.2-15.9 6.6-24.2 5.8-8.3-.9-17-6-22.4-13.7-5.4-7.7-7.7-18.1-4.5-26.1 3.1-7.9 11.7-13.5 19.5-18 7.7-4.4 14.7-7.8 22.3-8.6 7.6-.8 15.9 1 22.8 5.6z"
                transform="translate(50 50)"
                style={{
                  WebkitTransition: "all 0.3s ease 0s",
                  transition: "all 0.3s ease 0s",
                }}
              >
              </path>

              <text x="18" y="55" fill="white" class="small">mennyei</text>
          </svg>

          <svg viewBox="0 0 200 40">
            <text x="20" y="25" class="small">csak</text>
            <text x="45" y="34" class="medium">neked</text>
          </svg>

          <div className='special-product right'>    
          <Link to="/termek/gzNEkM-YU8">

            <img src='https://images.pexels.com/photos/5720907/pexels-photo-5720907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'/>
            <div className='main-product-data'>epres sajttorta</div>
            <div class="overlay"></div>
            </Link>
        </div>
  </div>

        <div className="product-grid parallax">

        <div className='special-product left'>  
          <Link to="/termek/igN4P3KDTq">
        
            <img src='https://images.pexels.com/photos/10496927/pexels-photo-10496927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'/>
            <div className='main-product-data'>Jack Daniel's-alma</div>
            <div class="overlay"></div>
          </Link>
        </div>

            <svg viewBox="0 0 200 40">
            <text x="20" y="25" class="small">mert</text>
            <text x="50" y="40" class="medium">megérdemled</text>
          </svg>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" className="home-svg">
                <defs>
                  <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255, 231.447, 220.299, 1)"></stop>
                    <stop offset="100%" stopColor="rgba(255, 179.286, 159.969, 1)"></stop>
                  </linearGradient>
                  
                </defs>
                <path
                  fill="url(#sw-gradient)"
                  strokeWidth="0"
                  d="M23.5-26.8c7 4.6 12.6 12 14 20.2 1.4 8.1-1.4 16.9-6.7 22.8-5.2 5.9-12.9 8.8-20.8 12-7.8 3.2-15.9 6.6-24.2 5.8-8.3-.9-17-6-22.4-13.7-5.4-7.7-7.7-18.1-4.5-26.1 3.1-7.9 11.7-13.5 19.5-18 7.7-4.4 14.7-7.8 22.3-8.6 7.6-.8 15.9 1 22.8 5.6z"
                  transform="translate(50 50)"
                  style={{
                    WebkitTransition: "all 0.3s ease 0s",
                    transition: "all 0.3s ease 0s",
                  }}
                >
                </path>

                <text x="10" y="58" fill="white" class="small">különleges</text>
          </svg>

       
</div>



     
    </div>
  )
}




