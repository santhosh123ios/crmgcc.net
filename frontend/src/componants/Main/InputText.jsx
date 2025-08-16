import React from 'react'
import './Main.css'

function InputText({ type = 'text', placeholder, name, value, onChange, onKeyPress, maxLength }) {
  return (
    <div className='input-div-views'>
        <input className='input-text'
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        maxLength={maxLength}
      />
    </div>
  )
}

export default InputText
