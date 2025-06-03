import React, { useState } from 'react'
import '/src/App.css'
import HeaderAdmin from '../../componants/Admin/HeaderAdmin'
import DashboardAdmin from '../../pages/admin/DashboardAdmin';
import VendorAdmin from '../../pages/admin/VendorAdmin';
import MembersAdmin from '../../pages/admin/MembersAdmin';
import CardAdmin from '../../pages/admin/CardAdmin';
import TransactionAdmin from '../../pages/admin/TransactionAdmin';
import AdminLeads from '../../pages/admin/AdminLeads';
import ComplaintsAdmin from '../../pages/admin/ComplaintsAdmin';
import AdminProfile from '../../pages/admin/AdminProfile';
import Offers from '../../pages/admin/Offers';
import Notification from '../../pages/admin/Notification';

const DashboardLayoutAdmin = () => {

  const [selected, setSelected] = useState('dashboard');

  const renderContent = () => {
    switch (selected) {

      case 'dashboard':
        return <DashboardAdmin/>;
      case 'leads':
        return <AdminLeads/>;
      case 'members':
        return <MembersAdmin/>;
      case 'vendor':
        return <VendorAdmin/>;
      case 'transaction':
        return <TransactionAdmin/>;
      case 'complaints':
        return <ComplaintsAdmin/>;
      case 'card':
        return <CardAdmin/>;
      case 'profile':
        return <AdminProfile/>;
      case 'offers':
        return <Offers/>;
      case 'notification':
          return <Notification/>;
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

export default DashboardLayoutAdmin
