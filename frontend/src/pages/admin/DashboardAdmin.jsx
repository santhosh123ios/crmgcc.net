import React,{useEffect,useState} from 'react'
import DashboardBox from '../../componants/Main/DashboardBox';
import apiClient from '../../utils/ApiClient';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DashboardAdmin() {

  const [dashboard, setDashboard] = useState({});
  const [trReport, setTrReport] = useState([]);
  const [leadReport, setLeadReport] = useState([]);
  

  const optionsBrand = {
        chart: {
            type: 'bar',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
            }
        },
        title: {
            text: 'Top 5 Vendors',
            style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
            }
        },
        xAxis: {
            categories: dashboard?.vendors_report?.map(item => String(item.vendor_name)),
            title: {
            text: null
            },
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#6b7280'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
            text: 'Sales',
            align: 'high',
            style: {
                fontSize: '12px',
                color: '#6b7280'
            }
            },
            labels: {
            overflow: 'justify',
            style: {
                fontSize: '11px',
                color: '#6b7280'
            }
            }
        },
        tooltip: {
            valueSuffix: ' units',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        plotOptions: {
            bar: {
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '11px',
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
            data: dashboard?.vendors_report?.map(item => Number(item.lead_count)),
            }
        ]
    };


    const transaction_options = {
      chart: {
        type: 'line',
         backgroundColor: 'transparent',
         height: 270,
         style: {
             fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
         }
      },
      title: {
        text: 'Weekly Transaction Report (Current Month)',
        style: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
        }
      },
      xAxis: {
        categories: trReport.map(item => `Week ${item.week_number}`),
        labels: {
            style: {
                fontSize: '12px',
                color: '#6b7280'
            }
        }
      },
      yAxis: {
        title: {
          text: 'Amount',
          style: {
              fontSize: '12px',
              color: '#6b7280'
          }
        },
        min: 0,
        labels: {
            style: {
                fontSize: '11px',
                color: '#6b7280'
            }
        }
      },
      tooltip: {
        shared: true,
        valuePrefix: '$',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      },
      series: [
        {
          name: 'Total Credit',
          data: dashboard?.transaction_report?.map(item => Number(item.total_credit)),
          color: '#10b981',
          lineWidth: 3,
          marker: {
              radius: 4,
              symbol: 'circle'
          }
        },
        {
          name: 'Total Debit',
          data: dashboard?.transaction_report?.map(item => Number(item.total_debit)),
          color: '#ef4444',
          lineWidth: 3,
          marker: {
              radius: 4,
              symbol: 'circle'
          }
        }
      ],
      responsive: {
        rules: [{
          condition: {
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              itemStyle: {
                  fontSize: '12px',
                  color: '#6b7280'
              }
            }
          }
        }]
      }
    };

    const leads_options = {
      chart: {
        type: 'line',
         backgroundColor: 'transparent',
         height: 270,
         style: {
             fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
         }
      },
      title: {
        text: 'Weekly Leads Report (Current Month)',
        style: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
        }
      },
      xAxis: {
        categories: leadReport.map(item => `Week ${item.week_number}`),
        labels: {
            style: {
                fontSize: '12px',
                color: '#6b7280'
            }
        }
      },
      yAxis: {
        title: {
          text: 'Count',
          style: {
              fontSize: '12px',
              color: '#6b7280'
          }
        },
        min: 0,
        labels: {
            style: {
                fontSize: '11px',
                color: '#6b7280'
            }
        }
      },
      tooltip: {
        shared: true,
        valuePrefix: '$',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      },
      series: [
        {
          name: 'Total Leads',
          data: dashboard?.leads_report?.map(item => Number(item.total_leads)),
          color: '#8b5cf6',
          lineWidth: 3,
          marker: {
              radius: 4,
              symbol: 'circle'
          }
        }
      ],
      responsive: {
        rules: [{
          condition: {
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              itemStyle: {
                  fontSize: '12px',
                  color: '#6b7280'
              }
            }
          }
        }]
      }
    };

    useEffect(() => {
        fetchDashboard();
    },[]);


    ///API CALLING
    const fetchDashboard = async () => {
      //setLoadingWallet(true);
      try {
      const response = await apiClient.get("/admin/get_dashboard");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setDashboard(response.result);
          setTrReport(response.result.transaction_report);
          setLeadReport(response.result.transaction_report);

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      //setLoadingWallet(false);
      }
    };

  return (

    <div  className='content-view'>
      <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        flexDirection: 'row',
        gap: '10px'
      }}>
          <div style={{
              width: '20%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '2px',
              transition: 'width 0.3s ease'
          }}>

            {/* Stats Cards Section */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr,1fr,1fr,1fr', 
              gap: '10px', 
              height: '300px'
            }}>
              {/* Total Members Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="#3b82f6"/>
                      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="#3b82f6"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      Total Members
                    </p>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: '0',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {dashboard?.member_total || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Total Vendors Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="#f59e0b"/>
                      <path d="M7 7H17V9H7V7Z" fill="#f59e0b"/>
                      <path d="M7 11H17V13H7V11Z" fill="#f59e0b"/>
                      <path d="M7 15H14V17H7V15Z" fill="#f59e0b"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      Total Vendors
                    </p>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: '0',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {dashboard?.vendor_total || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Total Leads Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#8b5cf6"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      Total Leads
                    </p>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: '0',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {dashboard?.leads_total || 0}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Total Transactions Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease-in-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#10b981"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      Total Transactions
                    </p>
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: '0',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      {dashboard?.transaction_total || 0}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div style={{
              width: '40%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '2px',
              transition: 'width 0.3s ease',
              gap: '10px'
          }}>

            <div style={{
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.3s ease',
              backgroundColor:'white',
              boxSizing:'border-box'
            }}>

              <HighchartsReact highcharts={Highcharts} options={leads_options} />
            
            </div>

            <div style={{
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.3s ease',
              backgroundColor:'white',
              boxSizing:'border-box'
            }}>

              <HighchartsReact highcharts={Highcharts} options={transaction_options} />

              {/* Transaction Report Chart */}
              {/* <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                
              }}>
                <HighchartsReact highcharts={Highcharts} options={transaction_options} />
              </div> */}

            </div>

          </div>



          <div style={{
              width: '40%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '2px',
              transition: 'width 0.3s ease'
          }}>

            {/* Top Vendors Chart */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                
              }}>
                <HighchartsReact highcharts={Highcharts} options={optionsBrand} />
              </div>

          </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
