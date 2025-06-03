import React from 'react'
import '/src/App.css'
import HeaderAdmin from '../../componants/Admin/HeaderAdmin'
import { useState } from 'react';
import DashboardAdmin from '../../pages/admin/DashboardAdmin';
import VendorAdmin from '../../pages/admin/VendorAdmin';
import MembersAdmin from '../../pages/admin/MembersAdmin';

const Home = () => {
  const [selected, setSelected] = useState('dashboard');

  const renderContent = () => {
    switch (selected) {

      case 'dashboard':
        return <DashboardAdmin/>;
      case 'members':
        return <MembersAdmin/>;
      case 'vendor':
        return <VendorAdmin/>;
      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <div className='home-layout'>
        <HeaderAdmin selected={selected} setSelected={setSelected}></HeaderAdmin>

        <div className="content">{renderContent()}</div>
    </div>
  )
}

export default Home