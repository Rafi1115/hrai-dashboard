import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNotifications } from './hooks/useNotifications';
import NotificationForm from './components/NotificationForm';
import NotificationFilters from './components/NotificationFilters';
import NotificationList from './components/NotificationList';
import Pagination from './components/Pagination';

const NotificationPage = ({ onBackClick }) => {
  const {
    // State
    users,
    loading,
    usersLoading,
  listLoading,
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
  } = useNotifications();

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
      <NotificationForm
        users={users}
        usersLoading={usersLoading}
        onNotificationSent={fetchNotifications}
        currentPage={currentPage}
      />

      {/* Filters and Search */}
      <NotificationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        selectedNotifications={selectedNotifications}
        onBulkDelete={handleBulkDelete}
      />

      {/* Notification List */}
      <NotificationList
        groupedNotifications={groupedNotifications}
        selectedNotifications={selectedNotifications}
        onSelectNotification={handleSelectNotification}
        onDeleteNotification={handleDeleteNotification}
        onCancelScheduled={handleCancelScheduled}
        filteredNotifications={filteredNotifications}
    onSelectAll={handleSelectAll}
    listLoading={listLoading}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        nextPage={nextPage}
        previousPage={previousPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
    </div>
  );
};

export default NotificationPage;