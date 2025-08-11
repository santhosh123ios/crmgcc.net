import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faEnvelope, faExclamationTriangle, faCheckCircle, faInfoCircle, faTimes, faEye, faTrash, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import TextView from '../../componants/Main/TextView'
import '../member/Notification.css'

// Mock notification data for admins - replace with actual API calls
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'New Member Registration',
    message: 'A new member has registered. Please review their profile and approve if everything looks good.',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    category: 'members',
    priority: 'high'
  },
  {
    id: 2,
    type: 'info',
    title: 'System Maintenance Scheduled',
    message: 'System maintenance is scheduled for tonight at 2:00 AM. Expected downtime: 30 minutes.',
    timestamp: '2024-01-15T09:15:00Z',
    isRead: false,
    category: 'system',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'warning',
    title: 'High Transaction Volume',
    message: 'Transaction volume is 50% higher than usual. Please monitor system performance.',
    timestamp: '2024-01-14T16:45:00Z',
    isRead: true,
    category: 'transactions',
    priority: 'high'
  },
  {
    id: 4,
    type: 'success',
    title: 'Vendor Approval Request',
    message: 'Vendor "Tech Solutions Inc." has submitted their application for approval.',
    timestamp: '2024-01-14T14:20:00Z',
    isRead: true,
    category: 'vendors',
    priority: 'medium'
  },
  {
    id: 5,
    type: 'info',
    title: 'Daily Report Generated',
    message: 'Daily system report has been generated. Check admin dashboard for details.',
    timestamp: '2024-01-14T08:00:00Z',
    isRead: true,
    category: 'reports',
    priority: 'low'
  },
  {
    id: 6,
    type: 'warning',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP address 192.168.1.100.',
    timestamp: '2024-01-13T12:30:00Z',
    isRead: false,
    category: 'security',
    priority: 'high'
  },
  {
    id: 7,
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily database backup has been completed successfully. Size: 2.3 GB.',
    timestamp: '2024-01-13T06:00:00Z',
    isRead: true,
    category: 'system',
    priority: 'low'
  }
]

function Notification() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('timestamp')

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesFilter = filter === 'all' || notification.category === filter
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp) - new Date(a.timestamp)
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (selectedNotification?.id === id) {
      setSelectedNotification(null)
      setShowDetail(false)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return faCheckCircle
      case 'warning': return faExclamationTriangle
      case 'info': return faInfoCircle
      default: return faBell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'info': return '#3B82F6'
      default: return '#6B7280'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      case 'low': return '#10B981'
      default: return '#6B7280'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getCategoryLabel = (category) => {
    const labels = {
      members: 'Members',
      system: 'System',
      transactions: 'Transactions',
      vendors: 'Vendors',
      reports: 'Reports',
      security: 'Security'
    }
    return labels[category] || category
  }

  return (
    <div className="notification-container">
      {/* Header */}
      <div className="notification-header">
        <div className="header-left">
          <div className="header-icon">
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
          <div>
            <TextView type="darkBold" text="Admin Notifications" className="header-title" />
            <TextView type="subDark" text={`${unreadCount} unread`} className="header-subtitle" />
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn secondary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="notification-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="members">Members</option>
            <option value="system">System</option>
            <option value="transactions">Transactions</option>
            <option value="vendors">Vendors</option>
            <option value="reports">Reports</option>
            <option value="security">Security</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="timestamp">Latest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="notification-content">
        {/* Notification List */}
        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon={faBell} className="empty-icon" />
              <TextView type="darkBold" text="No notifications found" />
              <TextView type="subDark" text="Try adjusting your search or filter criteria" />
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''} ${selectedNotification?.id === notification.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedNotification(notification)
                  setShowDetail(true)
                  if (!notification.isRead) {
                    markAsRead(notification.id)
                  }
                }}
              >
                <div className="notification-icon">
                  <FontAwesomeIcon 
                    icon={getNotificationIcon(notification.type)} 
                    style={{ color: getNotificationColor(notification.type) }}
                  />
                </div>
                <div className="notification-content">
                  <div className="notification-header-row">
                    <TextView 
                      type="darkBold" 
                      text={notification.title}
                      className="notification-title"
                    />
                    <div className="notification-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {notification.priority}
                      </span>
                      <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                  <TextView 
                    type="subDark" 
                    text={notification.message}
                    className="notification-message"
                  />
                  <div className="notification-footer">
                    <span className="category-tag">{getCategoryLabel(notification.category)}</span>
                    {!notification.isRead && <span className="unread-indicator" />}
                  </div>
                </div>
                <div className="notification-actions">
                  <button 
                    className="action-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNotification(notification)
                      setShowDetail(true)
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button 
                    className="action-icon-btn delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Detail */}
        {showDetail && selectedNotification && (
          <div className="notification-detail">
            <div className="detail-header">
              <TextView type="darkBold" text="Notification Details" className="detail-title" />
              <button 
                className="close-btn"
                onClick={() => setShowDetail(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="detail-content">
              <div className="detail-icon">
                <FontAwesomeIcon 
                  icon={getNotificationIcon(selectedNotification.type)} 
                  style={{ color: getNotificationColor(selectedNotification.type) }}
                />
              </div>
              
              <div className="detail-info">
                <TextView 
                  type="darkBold" 
                  text={selectedNotification.title}
                  className="detail-notification-title"
                />
                
                <div className="detail-meta">
                  <span className="detail-category">{getCategoryLabel(selectedNotification.category)}</span>
                  <span 
                    className="detail-priority"
                    style={{ backgroundColor: getPriorityColor(selectedNotification.priority) }}
                  >
                    {selectedNotification.priority} Priority
                  </span>
                  <span className="detail-timestamp">
                    {new Date(selectedNotification.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <div className="detail-message">
                  <TextView type="subDark" text={selectedNotification.message} />
                </div>
                
                <div className="detail-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      if (!selectedNotification.isRead) {
                        markAsRead(selectedNotification.id)
                      }
                    }}
                    disabled={selectedNotification.isRead}
                  >
                    {selectedNotification.isRead ? 'Already Read' : 'Mark as Read'}
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => deleteNotification(selectedNotification.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
