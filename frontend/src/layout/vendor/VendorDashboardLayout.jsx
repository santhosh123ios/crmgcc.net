import React, {useState} from 'react'
import HeaderVendor from '../../componants/vendor/HeaderVendor'
import DashboardVendor from '../../pages/vendor/DashboardVendor';
import LeadsVendor from '../../pages/vendor/LeadsVendor';
import TransactionsVendor from '../../pages/vendor/TransactionsVendor';
import MemberPage from '../../pages/vendor/MemberPage';
import ComplaintsVendor from '../../pages/vendor/ComplaintsVendor';
import VendorProfile from '../../pages/vendor/VendorProfile';
import OffersVendor from '../../pages/vendor/OffersVendor';
import ReportVendor from '../../pages/vendor/ReportVendor';
import Notification from '../../pages/vendor/Notification';

function VendorDashboardLayout() {
    const [selected, setSelected] = useState('dashboard');
    const renderContent = () => {
      switch (selected) {

        case 'dashboard':
          return <DashboardVendor/>;
        case 'leads':
          return <LeadsVendor/>;
        case 'transactions':
          return <TransactionsVendor/>;
        case 'member':
          return <MemberPage/>;
        case 'complaints':
          return <ComplaintsVendor/>;
        case 'profile':
          return <VendorProfile/>;
        case 'offers':
          return <OffersVendor/>;
        case 'report':
          return <ReportVendor/>;
        case 'notification':
          return <Notification/>;
        default:
          return <DashboardVendor />;
      }
    };

    return (
       <div className='home-layout'>
        <HeaderVendor selected={selected} setSelected={setSelected}></HeaderVendor>

        <div className="content">{renderContent()}</div>
    </div>
  )
}

export default VendorDashboardLayout
