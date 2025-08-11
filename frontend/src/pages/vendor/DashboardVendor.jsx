import React,{useEffect,useState} from 'react'
import TitleView from '../../componants/Main/TitleView'
import DashboardBox from '../../componants/Main/DashboardBox';
import apiClient from '../../utils/ApiClient';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CommonPopup from '../../componants/Main/CommonPopup';
import TextView from '../../componants/Main/TextView';
import ImportantPopup from '../../componants/Main/ImportantPopup';

function DashboardVendor() {
  const [dashboard, setDashboard] = useState({});
  const [trReport, setTrReport] = useState([]);
  const [leadReport, setLeadReport] = useState([]);
  const [cat, setCat] = useState([]);
  const [catPopup, setCatPopup] = useState(false);
  const [loadingCat, setLoadingCat] = useState(false);

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

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

    
    const handleCatListClick = (index) => {
      addCategory(cat[index].id)
    };


    ///API CALLING
    const fetchDashboard = async () => {
      setLoadingCat(true);
      try {
      const response = await apiClient.get("/vendor/get_dashboard");
      if (response?.result?.status === 1) {
          console.warn("Get Transaction successfully");
          setDashboard(response.result);
          setTrReport(response.result.transaction_report);
          setLeadReport(response.result.transaction_report);
          setCat(response.result.categorys);
          if(response.result.catData.length == 0)
          {
            setCatPopup(true)
          }
          else
          {
            setCatPopup(false)
          }

      } else {
          console.warn("No Transaction found or status != 1");
      }
      } catch (error) {
      console.error("Failed to fetch Transaction:", error);
      } finally {
      setLoadingCat(false);
      }
    };

    const addCategory = async (id) => {
      setLoadingCat(true)
      try {

          const payload = {
              id: id
          };

          console.log("SANTHOSH payload: "+payload)
          
          //console.log("SANTHOSH Vendor ID:", payload);
          const data = await apiClient.post("/vendor/add_vendor_category", payload);

          //if (data && data.result?.data.status === 1) {
          if (data?.result?.status === 1) {
                //getCategory();
                
          }
      } catch (err) {
          console.error("Something went wrong fetching vendors", err);
      }
      finally {
        setLoadingCat(false); // Hide loader
        setCatPopup(false)
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
                  width: '30%',
                  height: '100%',
                  backgroundColor: '#00000', 
                  display: 'flex',
                  flexDirection: 'column'
                }}>

                  {/* Stats Cards Grid */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon members-icon">👥</div>
                      <div className="stat-content">
                        <h3 className="stat-number">{formatNumber(dashboard?.member_total)}</h3>
                        <p className="stat-label">Total Members</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon vendors-icon">🏢</div>
                      <div className="stat-content">
                        <h3 className="stat-number">{formatNumber(dashboard?.vendor_total)}</h3>
                        <p className="stat-label">Total Vendors</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon leads-icon">📊</div>
                      <div className="stat-content">
                        <h3 className="stat-number">{formatNumber(dashboard?.leads_total)}</h3>
                        <p className="stat-label">Total Leads</p>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon transactions-icon">💰</div>
                      <div className="stat-content">
                        <h3 className="stat-number">{formatNumber(dashboard?.transaction_total)}</h3>
                        <p className="stat-label">Total Transactions</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon vendors-icon">🏢</div>
                      <div className="stat-content">
                        <h3 className="stat-number">{formatNumber(dashboard?.vendor_total)}</h3>
                        <p className="stat-label">Total Vendors</p>
                      </div>
                    </div>

                  </div>
              </div>

              <div style={{
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                  
                }}>

                  {/* Transaction Chart */}
                  <div className="chart-container">
                    <DashboardBox>
                      <div className="chart-header">
                        <h3>Transaction Trends</h3>
                        <p>Weekly credit vs debit</p>
                      </div>
                      <div className="chart-content">
                        <HighchartsReact highcharts={Highcharts} options={transaction_options} />
                      </div>
                    </DashboardBox>
                  </div>
                  

              </div>

              <div style={{
                  boxSizing: 'border-box',
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
              }}>

                {/* Leads Chart */}
                <div className="chart-container">
                  <DashboardBox>
                    <div className="chart-header">
                      <h3>Lead Generation</h3>
                      <p>Weekly lead performance</p>
                    </div>
                    <div className="chart-content">
                      <HighchartsReact highcharts={Highcharts} options={leads_options} />
                    </div>
                  </DashboardBox>
                </div>
                  
            </div>
      </div>
      {/* Category Selection Popup */}
      {catPopup && (
        <ImportantPopup>
          <div className="category-popup-content">
            <TextView type="darkBold" text="Select Your Brand Type" />
            <p className="category-subtitle">Choose the category that best describes your business</p>
            
            <div className="category-list">
              {loadingCat ? (
                <div className="loader-container">
                  <div className="spinner"></div>
                  <p>Loading categories...</p>
                </div>
              ) : (
                cat.map((catItems, index) => (
                  <div className="category-item" key={index}>
                    <DashboardBox>
                      <div className="category-item-content" onClick={() => handleCatListClick(index)}>
                        <div className="category-info">
                          <TextView type="darkBold" text={catItems?.name} />
                          <p className="category-description">Click to select this category</p>
                        </div>
                        <div className="category-arrow">→</div>
                      </div>
                    </DashboardBox>
                  </div>
                ))
              )}
            </div>
          </div>
        </ImportantPopup>
      )}
    </div>
  )
}

export default DashboardVendor
