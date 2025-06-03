import React from 'react'
import { Outlet } from 'react-router-dom'
import Home from './Home'
import '/src/App.css'
import LoginLayoutAdmin from '../admin/LoginLayoutAdmin'
import DashboardLayoutAdmin from '../admin/DashboardLayoutAdmin'


const Main = () => {
  return (
    <div className='main-layout'>
     <Outlet></Outlet>
     {/* <LoginLayoutAdmin></LoginLayoutAdmin> */}
    </div>
  )
}

export default Main

