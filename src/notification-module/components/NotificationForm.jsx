import React, { useState } from 'react';
import {
  BellIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ArrowDownCircleIcon
} from '@heroicons/react/24/outline';
import { notificationApi } from '../utils/apis';
import toast from 'react-hot-toast';

const NotificationForm = ({
  users,
  usersLoading,
  onNotificationSent,
  currentPage
}) => {
  const [pushTitle, setPushTitle] = useState('');
  const [pushRecipient, setPushRecipient] = useState('all');
  const [pushDescription, setPushDescription] = useState('');
  const [pushDate, setPushDate] = useState('');
  const [pushTime, setPushTime] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState(['push']);
  const [isScheduled, setIsScheduled] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({});

  // Available notification types
  const notificationTypes = [
    { id: 'push', label: 'Push Notification', icon: '📱' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'in_app', label: 'In-App', icon: '🔔' },
    // { id: 'sms', label: 'SMS', icon: '💬' }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Helper function to convert local datetime to UTC ISO string
  const convertToUTCISOString = (date, time) => {
    try {
      const localDateTime = new Date(`${date}T${time}`);
      if (isNaN(localDateTime.getTime())) {
        throw new Error('Invalid date or time');
      }
      return localDateTime.toISOString();
    } catch (error) {
      console.error('Error converting datetime:', error);
      throw new Error('Invalid date or time format');
    }
  };

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!pushTitle.trim()) {
      newErrors.title = 'Title is required';
    } else if (pushTitle.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (pushTitle.trim().length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    // Message validation
    if (!pushDescription.trim()) {
      newErrors.message = 'Message is required';
    } else if (pushDescription.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters long';
    } else if (pushDescription.trim().length > 500) {
      newErrors.message = 'Message must not exceed 500 characters';
    }

    // Recipients validation
    if (pushRecipient === 'specific' && selectedUsers.length === 0) {
      newErrors.recipients = 'Please select at least one user';
    }

    // Notification types validation
    if (selectedNotificationTypes.length === 0) {
      newErrors.notificationTypes = 'Please select at least one notification type';
    }

    // Schedule validation (only if scheduling is enabled)
    if (isScheduled) {
      if (!pushDate) {
        newErrors.date = 'Date is required for scheduled notifications';
      }
      if (!pushTime) {
        newErrors.time = 'Time is required for scheduled notifications';
      }
      
      // Validate future date/time
      if (pushDate && pushTime) {
        try {
          const scheduledDateTime = new Date(`${pushDate}T${pushTime}`);
          const now = new Date();
          if (scheduledDateTime <= now) {
            newErrors.datetime = 'Scheduled time must be in the future';
          }
        } catch (error) {
          newErrors.datetime = 'Invalid date or time format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if basic required fields are filled (for enabling schedule checkbox)
  const areBasicFieldsFilled = () => {
    return (
      pushTitle.trim().length >= 3 &&
      pushDescription.trim().length >= 5 &&
      selectedNotificationTypes.length > 0 &&
      (pushRecipient === 'all' || (pushRecipient === 'specific' && selectedUsers.length > 0))
    );
  };

  const handleNotificationTypeChange = (typeId) => {
    setSelectedNotificationTypes((prev) => {
      if (prev.includes(typeId)) {
        // Don't allow removing all types
        if (prev.length === 1) {
          toast.error("At least one notification type must be selected", {
            duration: 3000,
            style: {
              background: "#EF4444",
              color: "white",
            },
          });
          return prev;
        }
        return prev.filter((id) => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });

    // Clear notification types error
    if (errors.notificationTypes) {
      toast.dismiss();
      toast.success("Notification type error cleared", {
        duration: 2000,
        style: {
          background: "#10B981",
          color: "white",
        },
      });
      setErrors((prev) => ({ ...prev, notificationTypes: undefined }));
    }
  };

  const handleSendPushNotification = async () => {
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all the errors before sending the notification", {
        duration: 4000,
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
      return;
    }

    const loadingToast = toast.loading(
      isScheduled
        ? "Scheduling your notification..."
        : "Sending your notification...",
      {
        style: {
          background: "#3B82F6",
          color: "white",
        },
      }
    );

    try {
      let payload = {
        title: pushTitle.trim(),
        message: pushDescription.trim(),
        recipient_type: pushRecipient,
        notification_types: selectedNotificationTypes,
        user_ids: pushRecipient === "specific" ? selectedUsers : [],
      };

      console.log("Sending payload:", payload);

      let response;
      if (isScheduled && pushDate && pushTime) {
        try {
          payload.scheduled_at = convertToUTCISOString(pushDate, pushTime);

          const scheduledTime = new Date(payload.scheduled_at);
          const currentTime = new Date();

          if (scheduledTime <= currentTime) {
            toast.dismiss(loadingToast);
            toast.error(
              "Scheduled time must be in the future. Please select a valid date and time.",
              {
                duration: 4000,
                style: {
                  background: "#EF4444",
                  color: "white",
                },
              }
            );
            return;
          }

          response = await notificationApi.schedule(payload);
          console.log("Schedule response:", response);

          clearForm();
          toast.dismiss(loadingToast);

          const scheduledDate = new Date(payload.scheduled_at).toLocaleString();
          toast.success(
            `🎯 Notification scheduled successfully! Will be delivered to users on ${scheduledDate}`,
            {
              duration: 5000,
              style: {
                background: "#10B981",
                color: "white",
              },
            }
          );
        } catch (dateError) {
          toast.dismiss(loadingToast);
          toast.error(
            "Invalid date or time format. Please check your input and try again.",
            {
              duration: 4000,
              style: {
                background: "#EF4444",
                color: "white",
              },
            }
          );
          return;
        }
      } else {
        response = await notificationApi.sendImmediate(payload);
        console.log("Immediate send response:", response);

        clearForm();
        toast.dismiss(loadingToast);

        if (response.data?.sent_count === 0) {
          toast.warning(
            `⚠️ Notification was processed but reached no users. Please verify your recipient settings and try again.`,
            {
              duration: 6000,
              style: {
                background: "#F59E0B",
                color: "white",
              },
            }
          );
        } else if (response.data?.sent_count < response.data?.total_users) {
          toast.success(
            `✅ Notification sent successfully! Delivered to some users. Some users may have notification preferences disabled.`,
            {
              duration: 5000,
              style: {
                background: "#10B981",
                color: "white",
              },
            }
          );
        } else {
          toast.success(
            `🚀 Notification sent successfully! Your message has been received!`,
            {
              duration: 4000,
              style: {
                background: "#10B981",
                color: "white",
              },
            }
          );
        }
      }

      onNotificationSent(currentPage);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred while processing your notification";

      toast.error(
        `❌ Failed to ${isScheduled ? "schedule" : "send"} notification: ${errorMessage}. Please try again or contact support if the issue persists.`,
        {
          duration: 6000,
          style: {
            background: "#EF4444",
            color: "white",
          },
        }
      );

      console.log("Full error details:", {
        error,
        response: error.response?.data,
        payload,
      });
    }
  };

  const clearForm = () => {
    setPushTitle('');
    setPushDescription('');
    setPushRecipient('all');
    setSelectedUsers([]);
    setSelectedNotificationTypes(['push']);
    setPushDate('');
    setPushTime('');
    setIsScheduled(false);
    setUserSearchTerm('');
    setShowUserDropdown(false);
    setErrors({});
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
    
    // Clear recipients error
    if (errors.recipients) {
      setErrors(prev => ({ ...prev, recipients: undefined }));
    }
  };

  const getSelectedUserNames = () => {
    return selectedUsers.map(id => {
      const user = users.find(u => u.id === id);
      return user ? (user.name || user.email || user.username) : '';
    }).filter(Boolean).join(', ');
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (pushDate === today) {
      const currentTime = new Date(now.getTime() + 60000);
      return currentTime.toTimeString().slice(0, 5);
    }
    
    return '';
  };

  return (
    <div className="rounded shadow-xl p-8 mb-8 animate-fade-in">
      <h2 className="text-[22px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B2F7EF] via-[#001818] to-[#006663] drop-shadow-lg mb-6 flex items-center gap-3">
        <BellIcon className="h-7 w-7 text-[#00504d]" />
        <span className='text-[#000000]'>Create New Notification</span>
      </h2>

      {/* Notification Types Selection */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-black mb-2">
          Notification Types <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3 w-full">
          {notificationTypes.map(type => (
            <label key={type.id} className={`flex items-center w-full space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
              errors.notificationTypes ? 'border-red-500' : 'border-gray-300'
            }`}>
              <input
                type="checkbox"
                checked={selectedNotificationTypes.includes(type.id)}
                onChange={() => handleNotificationTypeChange(type.id)}
                className="h-4 w-4 text-[#013D3B] rounded"
              />
              <div className="flex items-center gap-3">
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm font-medium text-black">{type.label}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.notificationTypes && (
          <p className="text-red-500 text-sm mt-1">{errors.notificationTypes}</p>
        )}
        {selectedNotificationTypes.length > 0 && !errors.notificationTypes && (
          <p className="text-xs text-gray-600 mt-2">
            Selected: {selectedNotificationTypes.map(id => 
              notificationTypes.find(t => t.id === id)?.label
            ).join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 item-center">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Recipients <span className="text-red-500">*</span>
          </label>
          <select
            value={pushRecipient}
            onChange={(e) => {
              setPushRecipient(e.target.value);
              if (e.target.value === 'all') {
                setSelectedUsers([]);
                setShowUserDropdown(false);
              }
              // Clear recipients error
              if (errors.recipients) {
                setErrors(prev => ({ ...prev, recipients: undefined }));
              }
            }}
            className={`w-full p-4 border rounded focus:outline-none text-black bg-white ${
              errors.recipients ? 'border-red-500' : 'border-gray-400'
            }`}
          >
            <option value="all">All Users</option>
            <option value="specific">Select Specific Users</option>
          </select>
          {errors.recipients && (
            <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter notification title (3-100 characters)"
            value={pushTitle}
            onChange={(e) => {
              setPushTitle(e.target.value);
              // Clear title error
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: undefined }));
              }
            }}
            className={`w-full p-4 border rounded focus:outline-none text-black bg-white ${
              errors.title ? 'border-red-500' : 'border-gray-400'
            }`}
            maxLength="100"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
          {pushTitle && !errors.title && (
            <p className="text-xs text-gray-600 mt-1">{pushTitle.length}/100 characters</p>
          )}
        </div>
      </div>

      {pushRecipient === 'specific' && (
        <div className="mb-6">
          <label className="block text-sm font-bold text-black mb-2">
            Select Users <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div
              className={`w-full p-4 border rounded-xl cursor-pointer flex items-center justify-between bg-white ${
                errors.recipients ? 'border-red-500' : 'border-gray-400'
              }`}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <span className="text-[#000000] font-semibold">
                {selectedUsers.length === 0
                  ? 'Click to select users...'
                  : `${selectedUsers.length} user(s) selected: ${getSelectedUserNames().substring(0, 50)}${getSelectedUserNames().length > 50 ? '...' : ''}`
                }
              </span>
              <ArrowDownCircleIcon className={`h-7 w-7 text-[#0A6E6E] transition-transform ${showUserDropdown ? 'rotate-180' : ''} drop-shadow-lg`} />
            </div>
            {showUserDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-xl shadow-2xl max-h-60 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-[#013D3B]/20">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#0A6E6E]" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-3 py-3 border border-gray-400 rounded-xl focus:outline-none text-black bg-white"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {usersLoading ? (
                    <div className="p-4 text-center text-[#0A6E6E]">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-[#0A6E6E]">No users found</div>
                  ) : (
                    filteredUsers.map(user => (
                      <label key={user.id} className="flex items-center space-x-3 p-4 hover:bg-[#B2F7EF]/60 cursor-pointer rounded-xl">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="h-5 w-5 text-black rounded border-black"
                        />
                        <div className="flex-grow">
                          <div className="text-base font-bold text-black">
                            {user.name || user.username || 'Unknown'}
                          </div>
                          <div className="text-xs text-black">{user.email}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full text-black ${
                          user.status === 'Active' ? 'bg-green-100' : 'bg-red-100'
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
          {errors.recipients && (
            <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
          )}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-bold text-black mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Enter notification message (5-500 characters)"
          value={pushDescription}
          onChange={(e) => {
            setPushDescription(e.target.value);
            // Clear message error
            if (errors.message) {
              setErrors(prev => ({ ...prev, message: undefined }));
            }
          }}
          rows="3"
          className={`w-full p-4 border rounded focus:outline-none text-black resize-none bg-white ${
            errors.message ? 'border-red-500' : 'border-gray-400'
          }`}
          maxLength="500"
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
        {pushDescription && !errors.message && (
          <p className="text-xs text-gray-600 mt-1">{pushDescription.length}/500 characters</p>
        )}
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 text-black">
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={(e) => {
              if (e.target.checked && !areBasicFieldsFilled()) {
                toast.error('Please fill in all required fields (Title, Message, Recipients, and Notification Types) before scheduling.', {
                  duration: 4000,
                  style: {
                    background: '#EF4444',
                    color: 'white',
                  },
                });
                return;
              }
              setIsScheduled(e.target.checked);
              if (!e.target.checked) {
                setPushDate('');
                setPushTime('');
                // Clear schedule-related errors
                setErrors(prev => ({
                  ...prev,
                  date: undefined,
                  time: undefined,
                  datetime: undefined
                }));
              }
            }}
            className="h-5 w-5 text-[#013D3B] rounded"
            disabled={!areBasicFieldsFilled()}
          />
          <span className={`text-base font-bold ${areBasicFieldsFilled() ? 'text-black' : 'text-gray-400'}`}>
            Schedule for later {!areBasicFieldsFilled() && '(Fill required fields first)'}
          </span>
        </label>
      </div>

      {isScheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-[#013D3B] mb-2">
              Date <span className="text-red-500">*</span>
              <span className="text-xs text-gray-600">(your local timezone)</span>
            </label>
            <input
              type="date"
              value={pushDate}
              onChange={(e) => {
                setPushDate(e.target.value);
                if (e.target.value === getMinDate() && pushTime && pushTime < getMinTime()) {
                  setPushTime('');
                }
                // Clear date-related errors
                if (errors.date || errors.datetime) {
                  setErrors(prev => ({ ...prev, date: undefined, datetime: undefined }));
                }
              }}
              min={getMinDate()}
              className={`w-full p-4 border rounded shadow-lg focus:outline-none text-black bg-white ${
                errors.date || errors.datetime ? 'border-red-500' : 'border-gray-400'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-[#013D3B] mb-2">
              Time <span className="text-red-500">*</span>
              <span className="text-xs text-gray-600">(your local timezone)</span>
            </label>
            <input
              type="time"
              value={pushTime}
              onChange={(e) => {
                setPushTime(e.target.value);
                // Clear time-related errors
                if (errors.time || errors.datetime) {
                  setErrors(prev => ({ ...prev, time: undefined, datetime: undefined }));
                }
              }}
              min={getMinTime()}
              className={`w-full p-4 border rounded shadow-lg focus:outline-none text-black bg-white ${
                errors.time || errors.datetime ? 'border-red-500' : 'border-gray-400'
              }`}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
            {errors.datetime && (
              <p className="text-red-500 text-sm mt-1">{errors.datetime}</p>
            )}
            {pushDate === getMinDate() && (
              <p className="text-xs text-gray-600 mt-1">
                Minimum time: {getMinTime()} (current time + 1 minute)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Debug payload preview */}
      {/* {(pushTitle || pushDescription) && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Payload Preview:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              title: pushTitle.trim(),
              message: pushDescription.trim(),
              recipient_type: pushRecipient,
              notification_types: selectedNotificationTypes,
              ...(pushRecipient === 'specific' && { user_ids: selectedUsers }),
              ...(isScheduled && pushDate && pushTime && { 
                scheduled_at: convertToUTCISOString(pushDate, pushTime) 
              })
            }, null, 2)}
          </pre>
        </div>
      )} */}

      <button
        onClick={handleSendPushNotification}
        className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#013D3B] via-[#0A6E6E] to-[#013D3B] text-white font-extrabold rounded shadow-xl hover:scale-105 hover:from-[#0A6E6E] hover:to-[#013D3B] transition-all duration-200"
      >
        <PaperAirplaneIcon className="h-6 w-6" />
        {isScheduled ? 'Schedule Notification' : 'Send Now'}
      </button>
    </div>
  );
};

export default NotificationForm;