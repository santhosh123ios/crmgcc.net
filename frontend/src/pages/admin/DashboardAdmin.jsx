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
            type: 'bar', // 👈 This sets the chart to bar
             backgroundColor: 'transparent'
        },
        title: {
            text: 'Top 5 Vendors'
        },
        xAxis: {
            categories: dashboard?.vendors_report?.map(item => String(item.vendor_name)),
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
            data: dashboard?.vendors_report?.map(item => Number(item.lead_count)),
            }
        ]
    };


    const transaction_options = {
      chart: {
        type: 'line',
         backgroundColor: 'transparent',
         height: 270,
      },
      title: {
        text: 'Weekly Transaction Report (Current Month)'
      },
      xAxis: {
        categories: trReport.map(item => `Week ${item.week_number}`),
       
      },
      yAxis: {
        title: {
          text: 'Amount'
        },
        min: 0
      },
      tooltip: {
        shared: true,
        valuePrefix: '$'
      },
      series: [
        {
          name: 'Total Credit',
          data: dashboard?.transaction_report?.map(item => Number(item.total_credit)),
          color: 'green'
        },
        {
          name: 'Total Debit',
          data: dashboard?.transaction_report?.map(item => Number(item.total_debit)),
          color: 'red'
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
              verticalAlign: 'bottom'
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
      },
      title: {
        text: 'Weekly Leads Report (Current Month)'
      },
      xAxis: {
        categories: leadReport.map(item => `Week ${item.week_number}`),
       
      },
      yAxis: {
        title: {
          text: 'Count'
        },
        min: 0
      },
      tooltip: {
        shared: true,
        valuePrefix: '$'
      },
      series: [
        {
          name: 'Total Leads',
          data: dashboard?.leads_report?.map(item => Number(item.total_leads)),
          color: 'green'
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
              verticalAlign: 'bottom'
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
    <div className='content-view'>
      

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
                    <div style={{
                    boxSizing: 'border-box',
                    padding: '2px',
                    width: '100%',
                    height: '50%',
                    display: 'flex',
                    }}>
                      <DashboardBox>
                        <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>{dashboard?.member_total}</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Members
                            </p>
                        </div>
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
                        <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>{dashboard?.vendor_total}</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Vendors
                            </p>
                        </div>
                      </DashboardBox>
                    </div>
              </div>

              <div style={{
                  width: '40%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                  
                }}>
                  <div style={{
                  width: '100%',
                  height: '35%',
                  display: 'flex',
                  flexDirection:'row'
                  }}>
                      <div style={{
                      boxSizing: 'border-box',
                      padding: '2px',
                      width: '50%',
                      height: '100%',
                      display: 'flex',
                      }}>
                        <DashboardBox>
                          <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>{dashboard?.leads_total}</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Leads
                            </p>
                        </div>
                        </DashboardBox>
                    </div>

                      <div style={{
                      boxSizing: 'border-box',
                      padding: '2px',
                       width: '50%',
                      height: '100%',
                      display: 'flex',
                      }}>
                        <DashboardBox>
                          <div style={{width:'100%',height:'100%', display:'flex', justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <h1 style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>{dashboard?.transaction_total}</h1>
                            <p style={{padding:'0px',margin:'0px',color:'var(--text-primary)'}}>
                            Total Transactions
                            </p>
                        </div>
                        </DashboardBox>
                      </div>

                  </div>

                  <div style={{
                  boxSizing: 'border-box',
                  padding: '2px',
                  width: '100%',
                  height: '65%',
                  display: 'flex',
                  }}>
                    <DashboardBox>
                      <HighchartsReact highcharts={Highcharts} options={optionsBrand} />
                    </DashboardBox>
                  </div>

              </div>
              <div style={{
                  boxSizing: 'border-box',
                  width: '40%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                      boxSizing: 'border-box',
                      padding: '2px',
                      width: '100%',
                      height: '50%',
                      display: 'flex',
                    }}>
                        <DashboardBox>
                          <HighchartsReact highcharts={Highcharts} options={transaction_options} />
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
                          <HighchartsReact highcharts={Highcharts} options={leads_options} />
                        </DashboardBox>
                  </div>
              </div>
      </div>

    </div>
  )
}

export default DashboardAdmin
