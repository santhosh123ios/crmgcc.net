import React, { useEffect, useState } from 'react'
import TitleView from '../../componants/Main/TitleView'
import DashboardBox from '../../componants/Main/DashboardBox';
import apiClient from '../../utils/ApiClient';
import TextView from '../../componants/Main/TextView';
import { QRCodeCanvas } from "qrcode.react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const baseUrl = import.meta.env.VITE_API_BASE_IMG_URL;

function DashboardMember() {
    const content = "Welcome back,";
    const [loadingWallet, setLoadingWallet] = useState(true);
    const [wallet, setWallet] = useState({});
    const [profile, setProfile] = useState({});

    const options = {
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Inter, sans-serif'
            }
        },
        title: {
            text: 'Top Products Performance',
            style: {
                color: '#1f2937',
                fontSize: '16px',
                fontWeight: '600'
            }
        },
        xAxis: {
            categories: ['Shirts', 'Shoes', 'Bags', 'Watches', 'Glasses'],
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#6b7280'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Sales Volume',
                align: 'high',
                style: {
                    color: '#6b7280'
                }
            },
            labels: {
                overflow: 'justify',
                style: {
                    color: '#6b7280'
                }
            },
            gridLineColor: '#e5e7eb'
        },
        tooltip: {
            valueSuffix: ' units',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: true
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#374151',
                        fontWeight: '500'
                    }
                },
                borderRadius: 4,
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#3b82f6'],
                        [1, '#1d4ed8']
                    ]
                }
            }
        },
        credits: {
            enabled: false
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
    }, []);

    ///API CALLING
    const fetchProfile = async () => {
        try {
            const response = await apiClient.get("/member/get_profile");
            if (response?.result?.status === 1) {
                console.warn("Get Profile successfully");
                setProfile(response.result.data);
            } else {
                console.warn("No Profile found or status != 1");
            }
        } catch (error) {
            console.error("Failed to fetch Profile:", error);
        }
    };

    const fetchWallet = async () => {
        setLoadingWallet(true);
        try {
            const response = await apiClient.get("/member/get_walletDetails");
            if (response?.result?.status === 1) {
                console.warn("Get Wallet successfully");
                setWallet(response.result);
            } else {
                console.warn("No Wallet found or status != 1");
            }
        } catch (error) {
            console.error("Failed to fetch Wallet:", error);
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
                width: '100%',
                height: '100%',
                gap: '0px',
                flexDirection: 'column'
            }}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0px',
                    width: '100%',
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        height: '10px'
                    }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                fontSize: '28px',
                                fontWeight: '700',
                                color: '#1f2937',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {content} {profile?.name || 'Member'}!
                            </h1>
                        </div>
                    </div>

                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '20%',
                        height: '100%',
                    }}>
                        {/* Left Sidebar - Profile & QR */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            padding: '0px',
                            gap: '0px',
                            height: '100%',
                        }}>

                            {/* Profile Card */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #f3f4f6',
                                position: 'relative',
                                overflow: 'hidden',
                                marginTop: '17px',
                                marginRight: '5px',
                                marginLeft: '0px',
                                marginBottom: '10px',
                                height: '80%'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                }} />

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: '4px solid #f3f4f6',
                                        marginBottom: '16px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <img
                                            className='img-profile-dash'
                                            src={profile?.profile_img ? baseUrl + profile?.profile_img : "/dummy.jpg"}
                                            alt="Profile"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    <h3 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#1f2937'
                                    }}>
                                        {profile?.name || 'Member Name'}
                                    </h3>

                                    <p style={{
                                        margin: 0,
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        backgroundColor: '#f9fafb',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        {profile?.email || 'member@email.com'}
                                    </p>
                                </div>
                            </div>

                            {/* QR Code Card */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #f3f4f6',
                                textAlign: 'center',
                                marginTop: '0px',
                                marginRight: '5px',
                                marginLeft: '0px',
                                marginBottom: '17px',
                                height: '100%'
                            }}>
                                <h4 style={{
                                    margin: '0 0 16px 0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Your QR Code
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '16px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <QRCodeCanvas
                                        value={wallet?.card?.card_no}
                                        size={120}
                                        bgColor="white"
                                        fgColor="#1f2937"
                                    />
                                </div>
                                <p style={{
                                    margin: '12px 0 0 0',
                                    fontSize: '12px',
                                    color: '#9ca3af'
                                }}>
                                    Scan to access your account
                                </p>
                            </div>
                        </div>
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30%',
                        height: '100%'
                    }}>

                        {/* Products Chart */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f3f4f6',
                            height: '85%',
                            width: '85%'
                        }}>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                        </div>


                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '30%',
                        height: '100%',
                    }}>

                        {/* Recent Activity */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f3f4f6',
                            height: '85%',
                            width: '85%'

                        }}>
                            <h4 style={{
                                margin: '0 0 20px 0',
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1f2937'
                            }}>
                                Recent Activity
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { type: 'Points Earned', amount: '+150 pts', time: '2 hours ago', color: '#10b981' },
                                    { type: 'Transaction', amount: 'Purchase #1234', time: '1 day ago', color: '#3b82f6' },
                                    { type: 'Lead Generated', amount: 'New lead from Website', time: '2 days ago', color: '#f59e0b' },
                                    { type: 'Points Redeemed', amount: '-50 pts', time: '3 days ago', color: '#ef4444' }
                                ].map((activity, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: activity.color,
                                            marginRight: '16px'
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}>
                                                {activity.type}
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                color: '#6b7280'
                                            }}>
                                                {activity.time}
                                            </p>
                                        </div>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: activity.color
                                        }}>
                                            {activity.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '20%',
                        height: '100%',
                        flexDirection: 'column'
                    }}>
                        {/* Wallet Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f3f4f6',
                            position: 'relative',
                            overflow: 'hidden',
                            width: '80%',
                            marginTop: '17px',
                            marginRight: '0px',
                            marginLeft: '10px',
                            marginBottom: '10px',
                            height: '60%'
                        }}>
                            {loadingWallet ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '120px'
                                }}>
                                    <div className="spinner" />
                                </div>
                            ) : (
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        borderRadius: '0 16px 0 60px',
                                        opacity: 0.1
                                    }} />

                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{
                                            margin: '0 0 4px 0',
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {wallet?.card?.card_type_name || 'Card Type'}
                                        </p>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            color: '#1f2937'
                                        }}>
                                            Wallet
                                        </h3>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <p style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '14px',
                                            color: '#6b7280'
                                        }}>
                                            Available Balance
                                        </p>
                                        <h2 style={{
                                            margin: 0,
                                            fontSize: '32px',
                                            fontWeight: '800',
                                            color: '#059669',
                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {wallet?.available_point?.user_balance || '0'} pts
                                        </h2>
                                    </div>
                                </>
                            )}
                        </div>


                        {/* Leads Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #f3f4f6',
                            position: 'relative',
                            overflow: 'hidden',
                            width: '80%',
                            marginTop: '0px',
                            marginRight: '0px',
                            marginLeft: '10px',
                            marginBottom: '17px',
                            height: '100%'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                borderRadius: '0 16px 0 60px',
                                opacity: 0.1
                            }} />

                            <div style={{ marginBottom: '16px' }}>
                                <p style={{
                                    margin: '0 0 4px 0',
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Total Generated
                                </p>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#1f2937'
                                }}>
                                    Leads
                                </h3>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    color: '#3b82f6',
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                }}>
                                    46
                                </h2>
                            </div>

                            <div style={{
                                padding: '8px 12px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '20px',
                                display: 'inline-block'
                            }}>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#1d4ed8',
                                    fontWeight: '500'
                                }}>
                                    +12% this month
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default DashboardMember
