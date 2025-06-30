import React from 'react'

function CommonButton({text, color= '--highlight-color', onClick}) {
  return (
    <button
      className="common-btn"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default CommonButton