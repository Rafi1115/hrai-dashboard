// components/DashboardCards.js
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAmazon, FaHospitalUser } from "react-icons/fa";
import { MdGeneratingTokens } from "react-icons/md";
import { SiSololearn } from "react-icons/si";
import { FaCircleDollarToSlot } from 'react-icons/fa6';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { getApiUrl } from './configs/api';
import { getAuthConfig, isAuthenticated } from './configs/tokenManager';

const MetricCard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    totalUsers: 0,
    totalTokens: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Check authentication first
      if (!isAuthenticated()) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch real-time data from API with authentication
        const response = await axios.get(
          getApiUrl("/api/dashboard/overview/"),
          getAuthConfig()
        );
        const apiData = response.data.data;

        // Update state with real-time data from API
        setDashboardData({
          totalEarnings: apiData.total_earnings || 0,
          totalUsers: apiData.total_users || 0,
          totalTokens: apiData.total_tokens_used || 0,
          totalProducts: apiData.total_affiliate_products || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Auto-refresh data every 30 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);
  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };
  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-1 bg-white rounded p-6 shadow-xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="bg-gray-300 rounded-full w-12 h-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Error message if any */}
      {error && (
        <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Total Earning Card */}
        <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div>
            <p className="text-black text-sm font-normal">Total Earning</p>
            <h2 className="text-black text-3xl font-bold mt-1">
              {formatCurrency(dashboardData.totalEarnings)}
            </h2>
          </div>
          <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
            <FaCircleDollarToSlot className='w-10 h-10'/>
          </div>
        </div>
        {/* Total User Card */}
        <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div>
            <p className="text-black text-sm">Total Users</p>
            <h2 className="text-black text-3xl font-bold mt-1">
              {formatNumber(dashboardData.totalUsers)}
            </h2>
          </div>
          <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
            <HiMiniUserGroup className="w-10 h-10" />
          </div>
        </div>

        {/* Total Token Card */}
        <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div>
            <p className="text-black text-sm">Total Tokens</p>
            <h2 className="text-black text-3xl font-bold mt-1">
              {formatNumber(dashboardData.totalTokens)}
            </h2>
          </div>
          <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
            <MdGeneratingTokens className='w-10 h-10' />
          </div>
        </div>
        {/* Total Affiliate Products Card */}
        <div className="flex-1 bg-white rounded p-6 flex items-center justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div>
            <p className="text-black text-sm">Total Products</p>
            <h2 className="text-black text-3xl font-bold mt-1">
              {formatNumber(dashboardData.totalProducts)}
            </h2>
          </div>
          <div className="bg-[#013D3B] text-white rounded-full p-3 flex items-center justify-center w-12 h-12">
            <FaAmazon className='w-10 h-10' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;