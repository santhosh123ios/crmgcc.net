import React, { useState } from 'react'
import '/src/App.css'
import DashboardMember from '../../pages/member/DashboardMember';
import HeaderMember from '../../componants/member/HeaderMember';
import LeadsMember from '../../pages/member/LeadsMember';
import WalletMember from '../../pages/member/WalletMember';
import ComplaintsMember from '../../pages/member/ComplaintsMember';
import VendorPage from '../../pages/member/VendorPage';
import MemberProfile from '../../pages/member/MemberProfile';
import MemberOffers from '../../pages/member/MemberOffers';
import Notification from '../../pages/member/Notification';
import ReportMember from '../../pages/member/ReportMember';

function MemberDashboardLayout() {
  const [selected, setSelected] = useState('dashboard');

  const renderContent = () => {
    switch (selected) {

      case 'dashboard':
        return <DashboardMember/>;
      case 'leads':
        return <LeadsMember/>;
      case 'wallet':
        return <WalletMember/>;
      case 'vendor':
        return <VendorPage/>;
      case 'complaints':
        return <ComplaintsMember/>;
      case 'offers':
        return <MemberOffers/>;
      case 'report':
        return <ReportMember/>;
      case 'profile':
        return <MemberProfile/>;
      case 'notification':
          return <Notification/>;
      default:
        return <DashboardMember />;
    }
  };

  return (
    <div className='home-layout'>
        <HeaderMember selected={selected} setSelected={setSelected}></HeaderMember>

        <div className="content">{renderContent()}</div>
    </div>
  )
}

export default MemberDashboardLayout
