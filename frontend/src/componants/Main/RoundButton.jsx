import React from 'react'
import './Main.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function RoundButton({ icon, onClick ,style,shadow=false,iconColor='black', disabled=false}) {
  return (
    <button 
      className={shadow? "circle-btns-shadow" : "circle-btns" } 
      onClick={onClick}  
      style={style}
      disabled={disabled}
    >
        <FontAwesomeIcon icon={icon} style={{color: disabled ? '#ccc' : iconColor}}/>
    </button>
  )
}

export default RoundButton
