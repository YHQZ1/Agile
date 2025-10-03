import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { FiBriefcase, FiFileText, FiClock, FiCalendar, FiBell, FiCheck, FiTrash2, FiFilter, FiChevronRight } from 'react-icons/fi';
import '../../styles/Student/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Internship at Google',
      message: 'Google has posted new internship opportunities for summer 2023 matching your profile',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      type: 'job',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Application Status Update',
      message: 'Your application at Microsoft has moved to the final interview stage. Check your email for details.',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      type: 'application',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Deadline Approaching',
      message: 'Amazon internship applications close in 3 days. Complete your application soon!',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      read: false,
      type: 'reminder',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Workshop Invitation',
      message: 'You\'ve been invited to attend a technical interview preparation workshop tomorrow at 2 PM.',
      time: '3 days ago',
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      read: true,
      type: 'event',
      priority: 'low'
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [hasNew, setHasNew] = useState(true);
  const [activeTab] = useState("Notifications");
  const { darkMode } = useContext(ThemeContext);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
    setHasNew(false);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'job': return <FiBriefcase className="notification-icon" />;
      case 'application': return <FiFileText className="notification-icon" />;
      case 'reminder': return <FiClock className="notification-icon" />;
      case 'event': return <FiCalendar className="notification-icon" />;
      default: return <FiBell className="notification-icon" />;
    }
  };

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
      <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Notifications</span>
          </div>
        </div>

        <div className="notifications-header">
            <div className="header-top flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`unread-count ${unreadCount > 0 ? 'has-unread' : ''}`}>
                  {unreadCount} unread
                </span>
                <button 
                  onClick={markAllAsRead}
                  className="btn-mark-all"
                  disabled={unreadCount === 0}
                >
                  <FiCheck /> Mark all as read
                </button>
              </div>
            </div>

            <div className="filter-controls">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
              <button 
                className={`filter-btn ${filter === 'job' ? 'active' : ''}`}
                onClick={() => setFilter('job')}
              >
                <FiBriefcase /> Jobs
              </button>
              <button 
                className={`filter-btn ${filter === 'application' ? 'active' : ''}`}
                onClick={() => setFilter('application')}
              >
                <FiFileText /> Applications
              </button>
              <button 
                className={`filter-btn ${filter === 'event' ? 'active' : ''}`}
                onClick={() => setFilter('event')}
              >
                <FiCalendar /> Events
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
              >
                <FiFilter size={48} />
                <h3>No notifications found</h3>
                <p>Try changing your filters or check back later</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className={`notification-card ${notification.read ? 'read' : 'unread'} type-${notification.type} priority-${notification.priority}`}
                  >
                    <div className="notification-icon-container">
                      {getNotificationIcon(notification.type)}
                      {!notification.read && <div className="unread-dot"></div>}
                    </div>
                    <div className="notification-content">
                      <div className="flex items-center justify-between">
                        <h3>{notification.title}</h3>
                        <span className="notification-time" title={notification.timestamp.toLocaleString()}>
                          {notification.time}
                        </span>
                      </div>
                      <p>{notification.message}</p>
                      <div className="notification-actions">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="btn-mark-read"
                          >
                            <FiCheck /> Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="btn-delete"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
    </div>
  );
};

export default Notifications;