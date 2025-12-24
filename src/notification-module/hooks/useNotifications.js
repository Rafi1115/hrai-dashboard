import { useState, useEffect } from 'react';
import { notificationApi, userApi } from '../utils/apis';

export const useNotifications = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Filter states
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const userData = await userApi.fetchUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch notifications from API with filters
// In useNotifications.js - fetchNotifications function
const fetchNotifications = async (page = 1) => {
  try {
    setListLoading(true);

    const data = await notificationApi.fetchNotifications(
      page,
      searchTerm,
      filterStatus === 'all' ? '' : filterStatus,
      filterType === 'all' ? '' : filterType,
      ''
    );

    // Fix: Use the correct response structure
    setAllNotifications(data.notifications || []);  // Changed from data.results
    setTotalCount(data.stats?.total || 0);          // Changed from data.count

    // Handle pagination - your API might not have next/previous
    // You'll need to calculate these based on pagination object
    const pagination = data.pagination || {};
    setNextPage(pagination.has_next ? page + 1 : null);
    setPreviousPage(pagination.has_prev ? page - 1 : null);

  } catch (error) {
    console.error('Error fetching notifications:', error);
    alert('Failed to fetch notifications');
  } finally {
    setListLoading(false);
  }
};

  // Load data on component mount
  useEffect(() => {
    // On initial mount show full-page loading; subsequent fetches use listLoading
    (async () => {
      try {
        setLoading(true);
        await fetchNotifications(1);
        await fetchUsers();
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  fetchNotifications(1);
  }, [searchTerm, filterType, filterStatus]);

  // Since we're filtering on server, use allNotifications directly
  const filteredNotifications = allNotifications;

  // Group notifications by status and time
const groupedNotifications = {
  scheduled: allNotifications.filter(notif => notif.status === 'pending'),
  today: allNotifications.filter(notif => {
    if (notif.status === 'pending') return false;
    
    const sentDate = notif.sent_at ? new Date(notif.sent_at) : new Date(notif.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    sentDate.setHours(0, 0, 0, 0);
    
    return sentDate.getTime() === today.getTime();
  }),
  yesterday: allNotifications.filter(notif => {
    if (notif.status === 'pending') return false;
    
    const sentDate = notif.sent_at ? new Date(notif.sent_at) : new Date(notif.created_at);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    sentDate.setHours(0, 0, 0, 0);
    
    return sentDate.getTime() === yesterday.getTime();
  }),
  older: allNotifications.filter(notif => {
    if (notif.status === 'pending') return false;
    
    const sentDate = notif.sent_at ? new Date(notif.sent_at) : new Date(notif.created_at);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return sentDate < twoDaysAgo;
  })
};

  // Handle notification deletion
const handleDeleteNotification = async (notificationToDelete) => {
  try {
    // Use original_id for the delete API
    const deleteId = notificationToDelete.original_id || notificationToDelete.id;
    await notificationApi.delete(deleteId);
    
    // Remove from local state using the display id
    setAllNotifications(prev => prev.filter(notif => notif.id !== notificationToDelete.id));
    setTotalCount(prev => prev - 1);
    
    alert('Notification deleted successfully!');
    
  } catch (error) {
    console.error('Error deleting notification:', error);
    alert('Failed to delete notification');
  }
};

  // Handle bulk deletion
const handleBulkDelete = async () => {
  if (selectedNotifications.length === 0) {
    alert('Please select notifications to delete');
    return;
  }
  
  try {
    // Find the notifications and get their original_ids
    const notificationsToDelete = allNotifications.filter(notif => 
      selectedNotifications.includes(notif.id)
    );
    
    // Get original_ids for the bulk delete API
    const originalIds = notificationsToDelete.map(notif => 
      notif.original_id || notif.id
    );
    
    await notificationApi.bulkDelete(originalIds);

    // Remove from local state using display ids
    setAllNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setTotalCount(prev => prev - selectedNotifications.length);
    setSelectedNotifications([]);
    
    alert(`${selectedNotifications.length} notifications deleted successfully!`);
    
  } catch (error) {
    console.error('Error bulk deleting notifications:', error);
    alert('Failed to delete notifications');
  }
};

// Handle scheduled notification cancellation - use original_id
const handleCancelScheduled = async (notificationToCancel) => {
  try {
    // Use original_id for cancel API
    const cancelId = notificationToCancel.original_id || notificationToCancel.id;
    await notificationApi.cancelScheduled(cancelId);
    
    // Remove from local state using display id
    setAllNotifications(prev => prev.filter(notif => notif.id !== notificationToCancel.id));
    alert('Scheduled notification cancelled successfully!');
    
  } catch (error) {
    console.error('Error cancelling notification:', error);
    alert('Failed to cancel notification');
  }
};

  // Selection handlers
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

  return {
    // State
    allNotifications,
    users,
  loading,
  listLoading,
    usersLoading,
    currentPage,
    totalCount,
    nextPage,
    previousPage,
    selectedNotifications,
    filterType,
    filterStatus,
    searchTerm,
    filteredNotifications,
    groupedNotifications,

    // Setters
    setFilterType,
    setFilterStatus,
    setSearchTerm,

    // Handlers
    fetchNotifications,
    handleDeleteNotification,
    handleBulkDelete,
    handleCancelScheduled,
    handleSelectAll,
    handleSelectNotification,
    handleNextPage,
    handlePreviousPage
  };
};