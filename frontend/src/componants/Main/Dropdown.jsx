import React from 'react'

function Dropdown({data = [], selectedItem, onChange, firstItem = "Select" }) {
  return (
    <select className="dropdown" value={selectedItem} onChange={onChange}>
      <option value="">{firstItem}</option>
      {data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
