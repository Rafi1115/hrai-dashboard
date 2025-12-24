import React from 'react';
import { TrashIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NotificationItem = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onDelete, 
  onCancelScheduled 
}) => {
  const statusClasses = notification.is_read ? 'text-gray-500' : 'text-gray-900';
  const accentClass = notification.status === 'failed'
    ? 'bg-red-400'
    : notification.status === 'pending'
    ? 'bg-yellow-400'
    : 'bg-[#013D3B]';
  
  const getRelativeTime = (notification) => {
    // Handle different time formats from your API
    if (notification.sent_at) {
      return new Date(notification.sent_at).toLocaleString();
    }
    if (notification.created_at) {
      return new Date(notification.created_at).toLocaleString();
    }
    return 'Just now';
  };

  const getStatusBadge = () => {
    const status = notification.status;
    const base = 'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2';
    if (status === 'pending') {
      return <span className={`${base} bg-yellow-50 text-yellow-800 border border-yellow-100`}>Pending</span>;
    }
    if (status === 'sent') {
      return <span className={`${base} bg-green-50 text-green-800 border border-green-100`}>Sent</span>;
    }
    if (status === 'failed') {
      return <span className={`${base} bg-red-50 text-red-800 border border-red-100`}>Failed</span>;
    }
    return <span className={`${base} bg-gray-50 text-gray-800 border border-gray-100`}>Unknown</span>;
  };

  const getTypeBadges = () => {
    const emoji = { push: '🔔', email: '✉️', in_app: '💬' };
    const colors = {
      push: 'bg-blue-50 text-blue-800 border border-blue-100',
      email: 'bg-purple-50 text-purple-800 border border-purple-100',
      in_app: 'bg-indigo-50 text-indigo-800 border border-indigo-100'
    };

    const types = notification.notification_types || ['push'];

    return types.map(type => (
      <span key={type} className={`${colors[type]} px-3 py-1 rounded-full text-xs font-medium mr-2 inline-flex items-center`}>
        <span className="text-sm mr-1">{emoji[type] || '🔔'}</span>
        <span className="capitalize">{type.replace('_', ' ')}</span>
      </span>
    ));
  };

  const getRecipientText = () => {
    if (notification.recipient_type === 'all') {
      return `All Users (${notification.target_count || 0})`;
    }
    if (notification.recipient_type === 'specific') {
      return `${notification.target_count || 0} Selected Users`;
    }
    return 'Unknown Recipients';
  };

  const handleDelete = () => {
    toast.promise(
      onDelete(notification),
      {
        loading: 'Deleting notification...',
        success: 'Notification deleted successfully!',
        error: 'Failed to delete notification. Please try again.',
      },
      {
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      }
    );
  };

  const handleCancelScheduled = () => {
    toast.promise(
      onCancelScheduled(notification),
      {
        loading: 'Cancelling scheduled notification...',
        success: 'Scheduled notification cancelled successfully!',
        error: 'Failed to cancel scheduled notification. Please try again.',
      },
      {
        style: {
          background: '#F59E0B',
          color: 'white',
        },
      }
    );
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg bg-white border border-gray-100 shadow-lg  transition-shadow duration-200 ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
      role="article"
      aria-labelledby={`notification-title-${notification.id}`}
      tabIndex={0}
    >
      {/* colored accent */}
      <div className={`w-1 h-full rounded ${accentClass} self-stretch`} aria-hidden="true" />

      <div className="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(notification.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
          aria-label={`Select notification ${notification.title}`}
        />
      </div>

      <div className={`flex-1 min-w-0 ${statusClasses} transition-colors duration-200`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {getTypeBadges()}
              {getStatusBadge()}
            </div>

            <p className="text-xs text-gray-500 mb-1">To: {getRecipientText()}</p>

            <h4 id={`notification-title-${notification.id}`} className="text-sm md:text-base font-semibold text-gray-900 truncate mb-1">
              {notification.title}
            </h4>

            <p className="text-sm text-gray-700 mb-2 truncate">{notification.message}</p>

            {notification.status === 'sent' && (
              <p className="text-xs text-gray-500 mb-2">Sent: {notification.sent_count || 0} &nbsp;|&nbsp; Failed: {notification.failed_count || 0}</p>
            )}

            <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span>
                  {notification.status === 'pending' && notification.scheduled_at
                    ? `Scheduled for ${new Date(notification.scheduled_at).toLocaleString()}`
                    : getRelativeTime(notification)
                  }
                </span>
              </span>

              {notification.created_by && (
                <span>Created by: {notification.created_by.name}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-2">
            <div className="flex items-center gap-2">
              {/* {notification.status === 'pending' && (
                <button
                  onClick={handleCancelScheduled}
                  className="inline-flex items-center justify-center p-2 rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition"
                  title="Cancel scheduled notification"
                  aria-label="Cancel scheduled notification"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )} */}

              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                title="Delete notification"
                aria-label="Delete notification"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="text-right text-xs text-gray-400">
              <span className="block">{notification.recipient_type === 'all' ? `${notification.target_count || 0} recipients` : `${notification.target_count || 0} selected`}</span>
              <span className="block">{notification.channel || ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;