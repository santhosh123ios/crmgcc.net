import React from 'react'
import './Main.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function RoundButtonText({ icon,text, onClick }) {
  return (
    <button className="circle-btns-text" onClick={onClick} >
        <div>{text}</div>
        <FontAwesomeIcon icon={icon} />
    </button>
  )
}

export default RoundButtonText
