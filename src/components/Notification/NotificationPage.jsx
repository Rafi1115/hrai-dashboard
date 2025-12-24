import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeftIcon,
  TrashIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  UserIcon,
  BellIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const NotificationPage = ({ onBackClick }) => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  
  // Push notification form states
  const [pushTitle, setPushTitle] = useState('');
  const [pushRecipient, setPushRecipient] = useState('all');
  const [pushDescription, setPushDescription] = useState('');
  const [pushDate, setPushDate] = useState('');
  const [pushTime, setPushTime] = useState('');
  const [notificationType, setNotificationType] = useState('push');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  
  // User search and selection
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const now = useMemo(() => new Date(), []);
  const BASE_URL = 'https://api.hrlynx.ai';

  // Get auth token from cookie
  const getAuthToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="));
    return token ? token.split("=")[1] : null;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUsers(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/dashboard/notifications/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      setAllNotifications(data.results || []);
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const getRelativeTime = (timeAgo) => {
    if (timeAgo) return timeAgo;
    return 'Just now';
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [users, userSearchTerm]);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(notif => {
      const matchesType = filterType === 'all' || notif.notification_type === filterType;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'read' && notif.is_read) ||
        (filterStatus === 'unread' && !notif.is_read) ||
        (filterStatus === 'pending' && notif.status === 'pending') ||
        (filterStatus === 'sent' && notif.status === 'sent');
      const matchesSearch = !searchTerm || 
        notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.recipient?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [allNotifications, filterType, filterStatus, searchTerm]);

  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const older = [];
    const scheduled = [];

    filteredNotifications.forEach(notif => {
      if (notif.status === 'pending' || notif.scheduled_at) {
        scheduled.push(notif);
      } else {
        const timeAgo = notif.time_ago || '';
        if (timeAgo.includes('minute') || timeAgo.includes('hour')) {
          today.push(notif);
        } else if (timeAgo.includes('1 day') || timeAgo.includes('yesterday')) {
          yesterday.push(notif);
        } else {
          older.push(notif);
        }
      }
    });

    return { scheduled, today, yesterday, older };
  }, [filteredNotifications]);

  const handleSendPushNotification = async () => {
    if (!pushTitle || !pushDescription || (pushRecipient === 'specific' && selectedUsers.length === 0)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      let payload = {
        title: pushTitle,
        message: pushDescription,
        recipient_type: pushRecipient,
        notification_types: [notificationType]
      };

      let endpoint = `${BASE_URL}/api/notifications/admin/send-immediate/`;

      if (pushRecipient === 'specific') {
        payload.user_ids = selectedUsers;
      }

      // If scheduled, use schedule endpoint
      if (isScheduled && pushDate && pushTime) {
        payload.scheduled_at = `${pushDate}T${pushTime}:00`;
        endpoint = `${BASE_URL}/api/notifications/admin/schedule/`;
      }

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear form
      setPushTitle('');
      setPushDescription('');
      setPushRecipient('all');
      setSelectedUsers([]);
      setPushDate('');
      setPushTime('');
      setNotificationType('push');
      setIsScheduled(false);
      setUserSearchTerm('');
      setShowUserDropdown(false);
      
      alert(isScheduled ? 'Notification scheduled successfully!' : 'Notification sent successfully!');
      
      // Refresh notifications
      fetchNotifications(currentPage);
      
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to send notification';
      alert(errorMessage);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      await axios.delete(
        `${BASE_URL}/api/notifications/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Remove from local state immediately
      setAllNotifications(prev => prev.filter(notif => notif.id !== id));
      setTotalCount(prev => prev - 1);
      
      alert('Notification deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      alert('Please select notifications to delete');
      return;
    }
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      await axios.delete(
        `${BASE_URL}/api/notifications/bulk-delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            notification_ids: selectedNotifications
          }
        }
      );

      setAllNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setTotalCount(prev => prev - selectedNotifications.length);
      setSelectedNotifications([]);
      
      alert(`${selectedNotifications.length} notifications deleted successfully!`);
      
    } catch (error) {
      console.error('Error bulk deleting notifications:', error);
      alert('Failed to delete notifications');
    }
  };

  const handleCancelScheduled = async (id) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      await axios.post(
        `${BASE_URL}/api/notifications/admin/schedule/${id}/cancel/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setAllNotifications(prev => prev.filter(notif => notif.id !== id));
      alert('Scheduled notification cancelled successfully!');
      
    } catch (error) {
      console.error('Error cancelling notification:', error);
      alert('Failed to cancel notification');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (id, checked) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, id]);
    } else {
      setSelectedNotifications(prev => prev.filter(nId => nId !== id));
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (nextPage) {
      const pageNumber = currentPage + 1;
      setCurrentPage(pageNumber);
      fetchNotifications(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      const pageNumber = currentPage - 1;
      setCurrentPage(pageNumber);
      fetchNotifications(pageNumber);
    }
  };

  const getSelectedUserNames = () => {
    return selectedUsers.map(id => {
      const user = users.find(u => u.id === id);
      return user ? (user.name || user.email || user.username) : '';
    }).filter(Boolean).join(', ');
  };

  const NotificationItem = ({ notification }) => {
    const isSelected = selectedNotifications.includes(notification.id);
    const statusClasses = notification.is_read ? 'text-gray-500' : 'text-black';
    
    const getStatusBadge = () => {
      if (notification.status === 'pending' || notification.scheduled_at) {
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>;
      }
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Sent</span>;
    };

    const getTypeBadge = () => {
      const typeColors = {
        push: 'bg-blue-100 text-blue-800',
        email: 'bg-purple-100 text-purple-800',
        in_app: 'bg-indigo-100 text-indigo-800'
      };
      const type = notification.notification_type || 'push';
      return (
        <span className={`${typeColors[type]} px-2 py-1 rounded-full text-xs capitalize`}>
          {type.replace('_', ' ')}
        </span>
      );
    };

    return (
      <div className={`p-4 border-b border-gray-200 last:border-b-0 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => handleSelectNotification(notification.id, e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          
          <div className={`flex-grow ${statusClasses} transition-colors duration-200`}>
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  {getTypeBadge()}
                  {getStatusBadge()}
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  To: {notification.recipient || 'Unknown'}
                </p>
                <p className="text-base font-semibold mb-1">{notification.title}</p>
                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>
                      {(notification.status === 'pending' || notification.scheduled_at) && notification.scheduled_at
                        ? `Scheduled for ${new Date(notification.scheduled_at).toLocaleString()}`
                        : getRelativeTime(notification.time_ago)
                      }
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {(notification.status === 'pending' || notification.scheduled_at) && (
                  <button
                    onClick={() => handleCancelScheduled(notification.id)}
                    className="text-orange-600 hover:text-orange-400 p-1 rounded-full transition-colors"
                    title="Cancel scheduled notification"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="text-red-600 hover:text-red-400 p-1 rounded-full transition-colors"
                  title="Delete notification"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl text-black p-6 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded text-black p-6 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            className="text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors duration-200"
            onClick={onBackClick}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold">
            Notification Management ({totalCount})
          </h1>
        </div>
      </div>

      {/* Create New Notification Form */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <BellIcon className="h-6 w-6 text-blue-600" />
          <span>Create New Notification</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="push">Push Notification</option>
              <option value="email">Email</option>
              <option value="in_app">In-App</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
            <select
              value={pushRecipient}
              onChange={(e) => {
                setPushRecipient(e.target.value);
                if (e.target.value === 'all') {
                  setSelectedUsers([]);
                  setShowUserDropdown(false);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="specific">Select Specific Users</option>
            </select>
          </div>
        </div>

        {pushRecipient === 'specific' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Users</label>
            <div className="relative">
              <div 
                className="w-full p-3 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="text-gray-700">
                  {selectedUsers.length === 0 
                    ? 'Click to select users...' 
                    : `${selectedUsers.length} user(s) selected: ${getSelectedUserNames().substring(0, 50)}${getSelectedUserNames().length > 50 ? '...' : ''}`
                  }
                </span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {showUserDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {usersLoading ? (
                      <div className="p-4 text-center text-gray-500">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No users found</div>
                    ) : (
                      filteredUsers.map(user => (
                        <label key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <div className="flex-grow">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || user.username || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'Active'}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            placeholder="Enter notification title"
            value={pushTitle}
            onChange={(e) => setPushTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            placeholder="Enter notification message"
            value={pushDescription}
            onChange={(e) => setPushDescription(e.target.value)}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Schedule for later</span>
          </label>
        </div>

        {isScheduled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={pushDate}
                onChange={(e) => setPushDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={pushTime}
                onChange={(e) => setPushTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
        
        <button
          onClick={handleSendPushNotification}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
          {isScheduled ? 'Schedule Notification' : 'Send Now'}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="push">Push</option>
              <option value="email">Email</option>
              <option value="in_app">In-App</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleBulkDelete}
              disabled={selectedNotifications.length === 0}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium ${
                selectedNotifications.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <TrashIcon className="h-4 w-4" />
              Delete Selected ({selectedNotifications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {filteredNotifications.length > 0 && (
        <div className="mb-4 flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium">Select All</span>
          </label>
          <span className="text-sm text-gray-600">
            {selectedNotifications.length} of {filteredNotifications.length} selected
          </span>
        </div>
      )}

      {/* Notification Groups */}
      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([groupName, notifications]) => {
          if (notifications.length === 0) return null;
          
          const groupTitles = {
            scheduled: 'Scheduled',
            today: 'Today',
            yesterday: 'Yesterday',
            older: 'Older'
          };
          
          return (
            <div key={groupName}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <span>{groupTitles[groupName]}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {notifications.length}
                </span>
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {notifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">No notifications found</p>
          <p className="text-gray-400">Try adjusting your filters or create a new notification</p>
        </div>
      )}

      {/* Pagination */}
      {(nextPage || previousPage) && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreviousPage}
            disabled={!previousPage}
            className={`px-4 py-2 rounded-md font-medium ${
              previousPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className={`px-4 py-2 rounded-md font-medium ${
              nextPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;