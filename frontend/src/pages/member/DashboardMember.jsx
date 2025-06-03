import React,{useEffect,useState} from 'react'
import TitleView from '../../componants/Main/TitleView'
import DashboardBox from '../../componants/Main/DashboardBox';
import apiClient from '../../utils/ApiClient';
import TextView from '../../componants/Main/TextView';
import { QRCodeCanvas } from "qrcode.react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function DashboardMember() {
    const content = "Welcome in,";
    const [loadingWallet, setLoadingWallet] = useState(true);
    const [wallet, setWallet] = useState({});
    const [profile, setProfile] = useState({});

    const options = {
        chart: {
            type: 'bar', // 👈 This sets the chart to bar
             backgroundColor: 'transparent'
        },
        title: {
            text: 'Top 5 Products'
        },
        xAxis: {
            categories: ['Shirts', 'Shoes', 'Bags', 'Watches', 'Glasses'],
            title: {
            text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
            text: 'Sales',
            align: 'high'
            },
            labels: {
            overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' units'
        },
        plotOptions: {
            bar: {
            dataLabels: {
                enabled: true
            }
            }
        },
        credits: {
            enabled: true
        },
        series: [
            {
            name: '2025',
            data: [107, 31, 2, 10, 2]
            }
        ]
    };

    useEffect(() => {
        fetchProfile();
        fetchWallet();
    },[]);


    ///API CALLING
    const fetchProfile = async () => {
        //setLoading(true);
        try {
        const response = await apiClient.get("/member/get_profile");
        if (response?.result?.status === 1) {
            console.warn("Get Transaction successfully");
            setProfile(response.result.data);

        } else {
            console.warn("No Transaction found or status != 1");
        }
        } catch (error) {
        console.error("Failed to fetch Transaction:", error);
        } finally {
        //setLoading(false);
        }
    };

    const fetchWallet = async () => {
      setLoadingWallet(true);
      try {
      const response = await apiClient.get("/member/get_walletDetails");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setWallet(response.result);

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingWallet(false);
      }
    };


  return (
    <div className='content-view'>
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom:'10px'
          }}>

          <div>
            <TitleView text={content+" "+profile?.name} />
          </div>

          <div></div>
      </div>

      <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row'
            }}>

                <div style={{
                  width: '20%',
                  height: '100%',
                  backgroundColor: '#00000', 
                  display: 'flex',
                  flexDirection: 'column'
                    }}>

                    {/* Profile image view box    */}
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    }}>
                     <DashboardBox>
                        <img className='img-profile-dash' src={profile?.profile_img? baseUrl+profile?.profile_img : "/dummy.jpg"} alt="Remote Image" />
                        <div className="blur-box">
                            <div style={{padding:'10px'}}>
                                <p className="title-text-light">{profile?.name}</p>
                                <p className="sub-title-text-light">{profile?.email}</p>
                            </div>
                        </div>
                      </DashboardBox>
                   </div>

                    {/* QR Code view box    */}
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    }}>
                      <DashboardBox>
                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'100%' }}>
                            <QRCodeCanvas value={"text"} size={200} bgColor="transparent" fgColor="#000000" />
                        </div>
                      </DashboardBox>
                    </div>
                </div>
                {/* Brand list view box    */}
                

                <div style={{
                  width: '30%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                  
                  }}>

                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '40%',
                    display: 'flex',
                    }}>
                      
                        <div className='card-view-bg'>
                          {loadingWallet ? (
                            <div className="loader-container">
                                <div className="spinner" />
                            </div>
                            ) : (
                            <div style={{ boxSizing:'border-box', width:'100%',height:'100%'}}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', marginLeft: '10px', marginRight: '10px',height:'15%'}}>
                                    <p className="title-text-light">{wallet?.card?.card_type_name}</p>
                                    <p className="title-text-light">Wallet</p>
                                </div>

                                <div style={{ display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    padding: '0px', 
                                    marginLeft: '10px', 
                                    marginRight: '10px' , 
                                    height:'70%',
                                    fontSize:'25px',
                                    fontWeight:'bold',
                                    flexDirection:'column'}}>
                                    <TextView type="subLight" text={"Balance"}/>
                                    {wallet?.available_point?.user_balance}
                                    <TextView type="light" text={wallet?.card?.card_no.replace(/(.{4})/g, '$1    ').trim()}/>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px', marginLeft: '10px', marginRight: '10px',height:'15%'}}>
                                    <p className="title-text-light">{wallet?.user?.name}</p>
                                </div>
                            </div>
                             )}
                        </div>
                     
                    </div>
                    {/* line graph view box */}
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '30%',
                    display: 'flex',
                    }}>
                        <DashboardBox>
                            <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>46</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Leads
                            </p>
                        </div>
                        </DashboardBox>
                    </div>

                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '30%',
                    display: 'flex',
                    }}>
                        <DashboardBox>
                            <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>12</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Transactions
                            </p>
                        </div>
                        </DashboardBox>
                    </div>

                </div>
                 {/* Offers view box */}
                <div style={{
                  boxSizing: 'border-box',
                  padding: '2px',
                  width: '50%',
                  height: '100%',
                  display: 'flex',
                  flexDirection:'column'
                }}>
                    <div style={{
                        boxSizing: 'border-box',
                        padding: '2px',
                        width: '100%',
                        height: '50%',
                        display: 'flex',
                        }}>
                            <DashboardBox>
                                <HighchartsReact highcharts={Highcharts} options={options} />
                            </DashboardBox>
                    </div>

                    <div style={{
                        boxSizing: 'border-box',
                        padding: '2px',
                        width: '100%',
                        height: '50%',
                        display: 'flex',
                        }}>
                            <DashboardBox>
                                
                            </DashboardBox>
                    </div>
              </div>
      </div>

    </div>
  )
}

export default DashboardMember
