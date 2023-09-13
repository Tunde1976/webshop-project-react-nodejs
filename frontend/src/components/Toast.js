import React, { useCallback, useContext } from 'react'
import styled from "styled-components"
import { ToastContext } from '../context/ToastContext'


export default function Toast() {

    const [message, setMessage, toastTimer] = useContext(ToastContext);

    function clearToast() {
      setMessage({})
    }

    let bgcolor = `${message.success ? "#5e824d" : "#f15a5a"}`

    const ToastBox = styled.div`
      background-color: ${bgcolor};
      width: 20rem;
      color: white;
      font-weight: bold;
      font-size: 1.4rem;
      z-index: 1;
      position: absolute;
      top: 5rem;
      left: 40%;
      padding: 1rem;
      display: flex;  
      border-radius: 8px;   

    `

  return (
    <>
    {
        message.message && 
          <ToastBox>
            {message.message}
            <button id="toast-btn" onClick={clearToast}>X</button>
          </ToastBox>
    }
    </>
    
  )
}
