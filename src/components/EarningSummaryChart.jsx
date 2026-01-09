"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getApiUrl } from "./configs/api";
import { getAuthConfig, isAuthenticated } from "./configs/tokenManager";

const EarningOverviewChart = () => {
  // State for chart data, loading state, and dropdown functionality.
  const [currentEarningData, setCurrentEarningData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dynamic years - current year + last 4 years
  const getCurrentYear = () => new Date().getFullYear();
  const generateYears = () => {
    const currentYear = getCurrentYear();
    const years = [];
    for (let i = 4; i >= 0; i--) {
      years.push(currentYear - i);
    }
    return years;
  };

  const [years] = useState(generateYears());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  useEffect(() => {
    // Fetch data with year parameter
    async function fetchEarningData() {
      // Check authentication first
      if (!isAuthenticated()) {
        setError('Authentication required');
        setLoading(false);
        // Use fallback data if not authenticated
        const fallbackData = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ].map(month => ({
          month,
          height: 0,
          value: 0,
          active: false,
        }));
        setCurrentEarningData(fallbackData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Add year parameter to API call for real-time filtering
        const response = await axios.get(
          getApiUrl(`/api/dashboard/overview/?year=${selectedYear}`),
          getAuthConfig()
        );
        
        const apiData = response.data.data;
        const monthlyDataFromApi = apiData.monthly_data;

        // Map the API data to the format required by Recharts
        const mappedData = monthlyDataFromApi.map((item) => ({
          month: item.month,
          // We use the earnings value for both the bar height and the tooltip value.
          height: item.earnings,
          value: item.earnings,
          // Set active month based on non-zero earnings
          active: item.earnings > 0,
        }));

        setCurrentEarningData(mappedData);
      } catch (error) {
        console.error("Error fetching earning data:", error);
        
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Session expired. Please login again.');
        } else {
          setError('Failed to load earning data. Showing fallback data.');
        }
        
        // Fallback to empty data structure if API fails
        const fallbackData = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ].map(month => ({
          month,
          height: 0,
          value: 0,
          active: false,
        }));
        setCurrentEarningData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    fetchEarningData();
  }, [selectedYear]); // Re-run effect when the selected year changes

  const chartHeight = 161;
  const chartWidth = 737;

  // Custom Bar component to apply styling based on active state.
  const CustomBar = (props) => {
    const { x, y, width, height, payload } = props;
    const isActive = payload.active;

    // Use a foreignObject to apply Tailwind classes to the bars.
    return (
      <foreignObject x={x} y={y} width={width} height={height} style={{ overflow: 'visible' }}>
        <div
          style={{ width: width, height: height }}
          className={`w-10 ${isActive ? 'bg-[#013D3B]' : 'bg-gray-300'} rounded`}
        />
      </foreignObject>
    );
  };

  // Custom Tooltip component for a styled tooltip.
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white rounded shadow-xl text-black text-xs font-montserrat">
          <p className="font-bold">{label}</p>
          <p className="text-gray-600">{`Earning: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearSelect = (year, event) => {
    event.stopPropagation();
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  // Main component render logic.
  return (
    <div className="h-full w-full px-6 py-5 bg-white rounded shadow-xl flex flex-col justify-start items-start gap-2.5">
      {/* Header Section */}
      <div className="self-stretch flex flex-col justify-start items-start gap-14">
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-tight">
            Earning Overview
          </div>
          {/* Year Dropdown */}
          <div className="relative">
            <div
              className="p-2 bg-gray-200 rounded flex justify-start items-center gap-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="text-right text-black text-xs font-semibold font-montserrat leading-[10px]">
                {selectedYear}
              </div>
              {/* Dropdown Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-2.5 w-2.5 text-black transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-20 bg-white text-black rounded shadow-lg z-50">
                {years.map((year) => (
                  <div
                    key={year}
                    className="px-4 py-2 text-black text-xs font-semibold font-montserrat leading-[10px] hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => handleYearSelect(year, e)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="w-full px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs">
            {error}
          </div>
        )}

        {/* Chart Section */}
        <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
          <div className=" flex items-center gap-4 relative w-full">
            <div className="absolute top-0 left-0 w-full h-0 border-t border-dashed border-gray-400 z-10"></div>
            <div className="absolute right-0 bg-white text-black text-xs font-medium font-montserrat leading-tight z-10">
              {/* Display the max value from the current data */}
              {currentEarningData.length > 0 ? `$${Math.max(...currentEarningData.map(item => item.value)).toFixed(2)}` : ""}
            </div>
          </div>

          <div
            className="w-full"
            style={{ height: `${chartHeight + 20}px` }}
          >
            {/* Show a loading message if data is being fetched */}
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#013D3B] rounded-full animate-spin"></div>
                  Loading chart data...
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentEarningData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{
                      fill: "#6b7280",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "Montserrat",
                    }}
                    height={30}
                  />
                  <YAxis
                    hide
                    domain={[0, Math.max(...currentEarningData.map(item => item.value)) * 1.2]} // Adjust Y-axis domain dynamically
                  />
                  <Tooltip cursor={false} content={<CustomTooltip />} />
                  <Bar
                    dataKey="height"
                    shape={<CustomBar />}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningOverviewChart;