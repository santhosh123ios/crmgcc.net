import React, { useState } from 'react'

function Notification() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Reward Points Added",
      message: "You've earned 50 points for your recent purchase!",
      type: "reward",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Special Offer Available",
      message: "20% off on all electronics this weekend only!",
      type: "offer",
      timestamp: "2024-01-15T09:15:00Z",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Account Verification Complete",
      message: "Your account has been successfully verified.",
      type: "account",
      timestamp: "2024-01-14T16:45:00Z",
      isRead: true,
      priority: "low"
    },
    {
      id: 4,
      title: "Payment Successful",
      message: "Your payment of $25.99 has been processed successfully.",
      type: "payment",
      timestamp: "2024-01-14T14:20:00Z",
      isRead: true,
      priority: "medium"
    },
    {
      id: 5,
      title: "Welcome to Reward Club!",
      message: "Thank you for joining our loyalty program. Start earning points today!",
      type: "welcome",
      timestamp: "2024-01-13T11:00:00Z",
      isRead: true,
      priority: "low"
    }
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'reward': return '🎁';
      case 'offer': return '🏷️';
      case 'account': return '👤';
      case 'payment': return '💳';
      case 'welcome': return '👋';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className='content-view'>

      <div style={{
          width: '100%',
          height: '10%',
          display: 'flex',
          flexDirection: 'row',
      }}>

        {/* Notification Header */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f9fa', 
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid #e9ecef',
          borderRadius: '10px 10px 0 0',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Notifications</h2>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                fontSize: '12px',
                fontWeight: 'bold',
                width: '30px',
                height: '30px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          
        </div>

      </div>


      <div style={{
          width: '100%',
          height: '90%',
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '0px 0px 10px 10px',
          overflow: 'hidden'
      }}>
        {/* Notification List */}
        <div style={{
          width: '40%',
          height: '100%',
          backgroundColor: '#ffffff', 
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e9ecef',
          overflowY: 'auto'
        }}>
          {notifications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
              <div style={{ fontSize: '18px', fontWeight: '500' }}>No notifications</div>
              <div style={{ fontSize: '14px' }}>You're all caught up!</div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  setSelectedNotification(notification);
                  if (!notification.isRead) {
                    markAsRead(notification.id);
                  }
                }}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f1f3f4',
                  cursor: 'pointer',
                  backgroundColor: selectedNotification?.id === notification.id ? '#f8f9fa' : 'white',
                  transition: 'background-color 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedNotification?.id === notification.id ? '#f8f9fa' : 'white';
                }}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%'
                  }} />
                )}
                
                {/* Priority indicator */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  width: '4px',
                  height: '40px',
                  backgroundColor: getPriorityColor(notification.priority),
                  borderRadius: '2px'
                }} />
                
                <div style={{ marginLeft: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: notification.isRead ? '400' : '600',
                        color: notification.isRead ? '#6c757d' : '#2c3e50',
                        marginBottom: '4px',
                        lineHeight: '1.3'
                      }}>
                        {notification.title}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '11px',
                    color: '#adb5bd',
                    textAlign: 'right'
                  }}>
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Details */}  
        <div style={{
          width: '60%',
          height: '100%',
          backgroundColor: '#f8f9fa', 
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          {selectedNotification ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '32px' }}>
                  {getNotificationIcon(selectedNotification.type)}
                </span>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                    {selectedNotification.title}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#6c757d'
                  }}>
                    {formatTimestamp(selectedNotification.timestamp)}
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#2c3e50',
                  margin: '0'
                }}>
                  {selectedNotification.message}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px',
                  color: '#6c757d'
                }}>
                  Type: {selectedNotification.type}
                </div>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px',
                  color: '#6c757d'
                }}>
                  Priority: {selectedNotification.priority}
                </div>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px',
                  color: selectedNotification.isRead ? '#28a745' : '#dc3545'
                }}>
                  Status: {selectedNotification.isRead ? 'Read' : 'Unread'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📋</div>
              <div style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>
                Select a notification
              </div>
              <div style={{ fontSize: '14px' }}>
                Choose a notification from the list to view details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notification
