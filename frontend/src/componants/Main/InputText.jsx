import React from 'react'
import './Main.css'

function InputText({ type = 'text', placeholder, name, value, onChange }) {
  return (
    <div className='input-div-views'>
        <input className='input-text'
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default InputText
