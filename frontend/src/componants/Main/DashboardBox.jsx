import React from 'react'

function DashboardBox({ children, style }) {
  return (
    <div className='admin-item-box' style={style}>
      { children }
    </div>
  )
}

export default DashboardBox
