import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationItem from './NotificationItem';

const NotificationList = ({ 
  groupedNotifications,
  selectedNotifications,
  onSelectNotification,
  onDeleteNotification,
  onCancelScheduled,
  filteredNotifications,
  onSelectAll
  , listLoading
}) => {
  const groupTitles = {
    scheduled: 'Scheduled',
    today: 'Today',
    yesterday: 'Yesterday',
    older: 'Older'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#013D3B] via-[#0A6E6E] to-[#013D3B] p-2 rounded-md shadow">
            <BellIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">Review and manage your notifications</p>
          </div>
        </div>

        {/* header right (controls placeholder) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Add controls here if needed (filters, export, etc.) */}
        </div>
      </div>

      {/* Bulk Actions */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center justify-between bg-white  rounded p-3 shadow-lg">
          <div className="flex items-center gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedNotifications.length === filteredNotifications.length}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Select All</span>
            </label>
            <span className="text-sm text-gray-600">{selectedNotifications.length} of {filteredNotifications.length} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50">Actions</button>
          </div>
        </div>
      )}

      {/* Notification Groups */}
      {listLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-gray-500">Loading notifications...</div>
        </div>
      ) : (
      <div className="space-y-8">
        {Object.entries(groupedNotifications).map(([groupName, notifications]) => {
          if (!notifications || notifications.length === 0) return null;
          return (
            <section key={groupName} aria-labelledby={`group-${groupName}`} className="">
              <div className="flex items-center justify-between">
                <h3 id={`group-${groupName}`} className="text-base font-semibold text-gray-800 flex items-center gap-3">
                  <span>{groupTitles[groupName]}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{notifications.length}</span>
                </h3>
                <div className="text-sm text-gray-500">Showing {notifications.length}</div>
              </div>

              <div className="mt-3 grid gap-4">
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isSelected={selectedNotifications.includes(notification.id)}
                    onSelect={onSelectNotification}
                    onDelete={onDeleteNotification}
                    onCancelScheduled={onCancelScheduled}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
  )}

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-full max-w-md bg-white border border-dashed border-gray-200 rounded-lg p-8">
            <BellIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No notifications found</p>
            <p className="text-gray-400">Try adjusting your filters or create a new notification</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;