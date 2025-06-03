import React from 'react'

function TextButton({ text, onClick }) {
  return (
    <button className='text-button_comp'>{text} onClick={onClick} </button>
  )
}

export default TextButton
