import React from 'react'
import './Main.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function RoundButton({ icon, onClick ,style,shadow=false,iconColor='black'}) {
  return (
    <button className={shadow? "circle-btns-shadow" : "circle-btns" } onClick={onClick}  style={style} >
        <FontAwesomeIcon icon={icon} style={{color:iconColor}}/>
    </button>
  )
}

export default RoundButton
