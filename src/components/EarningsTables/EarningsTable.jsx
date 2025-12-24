"use client";

import React, { useState, useEffect, useCallback } from "react";
// We'll use axios for API calls, as you did in the original code.
import axios from "axios";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../configs/api";

// =========================================================================
// 1. Constants and Configuration
// It's a best practice to define configuration variables outside the
// component to prevent them from being redefined on every render.
// =========================================================================
const API_URL = getApiUrl("/api/dashboard/subscriptions/");
const ITEMS_PER_PAGE = 10; // The fixed page size for our API.

// =========================================================================
// 2. Main Component
// =========================================================================
export default function EarningsTable() {
  // =========================================================================
  // State Management
  // Using useState to manage all of the component's state.
  // =========================================================================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState("0.00"); // Added state for total earnings
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");

  // =========================================================================
  // 3. Data Fetching Logic (with exponential backoff for retries)
  // We use useCallback to memoize this function. This is crucial because
  // it prevents the function from being recreated on every render, which
  // would cause an infinite loop in the useEffect hook below.
  // =========================================================================
  const fetchSubscriptions = useCallback(async () => {
    // Start the loading state and clear previous errors.
    setLoading(true);
    setError(null);

    // Prepare the query parameters for the API call.
    const params = {
      page: currentPage,
      search: searchQuery,
    };

    // Add the plan filter only if it's not set to "All".
    if (planFilter !== "All") {
      params.plan_type = planFilter;
    }

    // Implement a simple exponential backoff for API retries.
    let retries = 0;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    while (retries < maxRetries) {
      try {
        const response = await axios.get(API_URL, { params });
        setData(response.data.results);
        setTotalCount(response.data.count);
        // Set the dynamic total earnings from API response
        setTotalEarnings(response.data.total_earnings || "0.00");
        setLoading(false);
        return; // Success, exit the loop
      } catch (err) {
        retries++;
        console.error(`Attempt ${retries} failed to fetch data.`);
        if (retries < maxRetries) {
          const delay = baseDelay * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // If all retries fail, set the error state.
          setError("Failed to fetch data. Please check your network and try again.");
          console.error("API call failed after all retries:", err);
          setLoading(false);
        }
      }
    }
  }, [currentPage, searchQuery, planFilter]); // The dependencies for useCallback.

  // =========================================================================
  // 4. useEffect Hook
  // This hook handles side effects. We want to fetch data whenever the
  // `searchQuery`, `planFilter`, or `currentPage` changes.
  // The logic is: when a filter or search changes, we reset the page to 1
  // and then trigger the data fetch.
  // =========================================================================
  useEffect(() => {
    // We don't need a separate handler for filter changes anymore.
    // By simply changing the state variables (`searchQuery`, `planFilter`),
    // this hook automatically detects the change and re-runs the data fetch.
    // We reset the page to 1 whenever a filter or search is applied.
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset page to 1 on search/filter change
      fetchSubscriptions();
    }, 500); // Debounce search input to avoid excessive API calls.

    return () => clearTimeout(timeoutId); // Cleanup function for the timeout.
  }, [fetchSubscriptions, searchQuery, planFilter]);

  // Handle page changes directly
  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage]);

  // =========================================================================
  // 5. Helper Functions
  // =========================================================================
  // Calculate total pages based on total count and items per page.
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Function to convert API plan type to a readable format.
  const getDisplayPlanName = (plan_type) => {
    if (plan_type && plan_type.includes("monthly")) {
      return "Monthly";
    } else if (plan_type && plan_type.includes("yearly")) {
      return "Yearly";
    }
    return "Unknown";
  };

  const router = useRouter();

  // The view details functionality is a good example of how you can redirect
  // to a new page. Since this is a self-contained component, we'll just
  // log the ID for demonstration. In a real Next.js app, you'd use `useRouter`.
  const handleViewDetails = (id) => {
    console.log(`Navigating to details page for ID: ${id}`);
    // In a real app, you would use:
    router.push(`/admin/earning/${id}`);
  };

  // =========================================================================
  // 6. Conditional Rendering for Loading and Error States
  // A skeleton loader provides a much better user experience than a simple
  // text message. It makes the UI feel more responsive and professional.
  // =========================================================================
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  // A component to render a single row of the skeleton loader.
  const SkeletonRow = () => (
    <tr className="border-b border-gray-200 animate-pulse">
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
      </td>
    </tr>
  );

  // =========================================================================
  // 7. Main Render Logic
  // =========================================================================
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-gray-900 font-inter">
      {/* Earnings Overview Card */}
      <h2 className="text-gray-900 text-2xl font-semibold mb-4">Subscriber Overview</h2>
      <div className="bg-[#013D3B] rounded-xl p-6 mb-6 w-full max-w-2xl shadow-xl text-white">
        <div className="text-md font-medium opacity-80">Total Earnings</div>
        <div className="text-4xl font-bold mt-1">
          ${loading ? (
            <span className="inline-block w-20 h-8 bg-white bg-opacity-20 rounded animate-pulse"></span>
          ) : (
            totalEarnings
          )}
        </div>
      </div>
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Email, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
          >
            <option value="All">All Plans</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      {/* Earnings Table */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-gray-900 table-auto">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="py-3 px-4 rounded-tl-lg">ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Subscription Plan</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show skeleton loader while data is being fetched
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : data.length > 0 ? (
              // Render table data if available
              data.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 px-4 font-medium">#{item.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{item.user_email}</div>
                    <div className="text-xs text-gray-500">{item.user_phone || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getDisplayPlanName(item.plan_type) === "Monthly"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getDisplayPlanName(item.plan_type)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">${item.price}</td>
                  <td className="py-3 px-4">{item.joined_date}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="text-orange-500 hover:text-orange-600 transition-colors duration-200"
                      aria-label={`View details for ${item.user_email}`}
                      title="View Details"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Display a "No records" message when data is empty
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-end items-center mt-6 text-gray-900 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg ${
                currentPage === i + 1
                  ? "bg-[#013D3B] text-white font-bold"
                  : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}