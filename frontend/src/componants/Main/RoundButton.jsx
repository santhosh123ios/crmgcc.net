import React from 'react'
import './Main.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function RoundButton({ icon, onClick }) {
  return (
    <button className="circle-btns" onClick={onClick} >
        <FontAwesomeIcon icon={icon} />
    </button>
  )
}

export default RoundButton
