"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from './configs/api';

// Client component for avatar image with fallback
function AvatarImage({ src, alt, fallbackText }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      className="w-8 h-8 rounded-full object-cover"
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(`https://placehold.co/34x34/CCCCCC/000000?text=${fallbackText}`)}
    />
  );
}

// Main component for the Recent Subscribers and Recent Products cards
const RecentSubscribersAndProducts = () => {
  const router = useRouter();
  
  // States for API data
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States to manage whether to show all items or limited list
  const [showAllSubscribers, setShowAllSubscribers] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(getApiUrl("/api/dashboard/overview/"));
        const apiData = response.data.data;

        // Map recent subscribers from API
        const subscribersFromApi = apiData.recent_subscribers.map((subscriber, index) => ({
          id: index + 1,
          name: subscriber.name,
          email: subscriber.email,
          time: subscriber.time,
          avatar: `https://placehold.co/34x34/60A5FA/FFFFFF?text=${subscriber.name.split(' ').map(n => n[0]).join('').toUpperCase()}`,
        }));

        // Map recent products from API
        const productsFromApi = apiData.recent_products.map((product, index) => ({
          id: product.id,
          title: product.title,
          category: product.category,
          totalClicks: product.total_clicks,
          addedTime: product.added_time,
          updatedTime: product.updated_time,
          image: product.image ? `https://api.hrlynx.ai${product.image}` : `https://placehold.co/34x34/8B5CF6/FFFFFF?text=${product.title.split(' ').map(n => n[0]).join('').toUpperCase()}`,
        }));

        setRecentSubscribers(subscribersFromApi);
        setRecentProducts(productsFromApi);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Fallback data if API fails
        setRecentSubscribers([
          {
            id: 1,
            name: 'Alex Manda',
            email: 'alex@example.com',
            time: 'Today, 16:36',
            avatar: 'https://placehold.co/34x34/60A5FA/FFFFFF?text=AM',
          },
          {
            id: 2,
            name: 'Jane Doe',
            email: 'jane@example.com',
            time: 'Yesterday, 10:00',
            avatar: 'https://placehold.co/34x34/F87171/FFFFFF?text=JD',
          }
        ]);

        setRecentProducts([
          {
            id: 1,
            title: 'HR Gifts',
            category: 'Talent Acquisition & Labor Trends',
            totalClicks: 0,
            addedTime: '00:10',
            image: 'https://placehold.co/34x34/8B5CF6/FFFFFF?text=HG',
          },
          {
            id: 2,
            title: 'HR T-Shirt',
            category: 'Compensation, Benefits & Rewards',
            totalClicks: 0,
            addedTime: '23:53',
            image: 'https://placehold.co/34x34/FBBF24/FFFFFF?text=HT',
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubscriber = () => {
    router.push("/admin/earning");
  };

  const handleProduct = () => {
    router.push("/admin/products");
  };

  // Toggle functions
  const handleViewAllSubscribersClick = () => {
    setShowAllSubscribers(!showAllSubscribers);
  };

  const handleViewAllProductsClick = () => {
    setShowAllProducts(!showAllProducts);
  };

  // Determine which lists to display
  const subscribersToShow = showAllSubscribers ? recentSubscribers : recentSubscribers.slice(0, 3);
  const productsToShow = showAllProducts ? recentProducts : recentProducts.slice(0, 3);

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-gray-500">Loading subscribers...</div>
        </div>
        <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex items-center justify-center">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Subscribers Card */}
      <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex flex-col justify-start items-start gap-3">
        {/* Card Title */}
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-loose">
            Recent Subscribers
          </div>
          {recentSubscribers.length > 3 && (
            <button
              onClick={handleViewAllSubscribersClick}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {showAllSubscribers ? 'View Less' : 'View All'}
            </button>
          )}
        </div>

        {/* Subscriber List */}
        <div className={`self-stretch flex flex-col justify-start items-start gap-1.5 ${showAllSubscribers ? 'h-52 overflow-y-auto scrollbar-hide' : ''}`}>
          {subscribersToShow.map((subscriber) => (
            <div
              key={subscriber.id}
              className="self-stretch py-2 border-b border-gray-200 flex justify-start items-center gap-12 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleSubscriber}
            >
              <div className="flex-1 flex justify-start items-center gap-3">
                <AvatarImage
                  src={subscriber.avatar}
                  alt={subscriber.name}
                  fallbackText={subscriber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                />
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="text-black text-sm font-semibold leading-normal">
                    {subscriber.name}
                  </div>
                  <div className="self-stretch text-gray-500 text-xs font-medium leading-tight">
                    {subscriber.email}
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  {subscriber.time}
                </div>
              </div>
            </div>
          ))}
          {subscribersToShow.length === 0 && (
            <div className="self-stretch py-4 text-center text-gray-500 text-sm">
              No recent subscribers
            </div>
          )}
        </div>
      </div>

      {/* Recent Products Card */}
      <div className="w-full px-6 py-6 bg-white rounded-lg shadow-xl flex flex-col justify-start items-start gap-3">
        {/* Card Title */}
        <div className="self-stretch flex justify-between items-center">
          <div className="text-black text-xl font-semibold leading-loose">
            Recent Products
          </div>
          {recentProducts.length > 3 && (
            <button
              onClick={handleViewAllProductsClick}
              className="text-purple-500 text-sm font-medium hover:text-purple-600 transition-colors"
            >
              {showAllProducts ? 'View Less' : 'View All'}
            </button>
          )}
        </div>

        {/* Products List */}
        <div className={`self-stretch flex flex-col justify-start items-start gap-1.5 ${showAllProducts ? 'h-52 overflow-y-auto scrollbar-hide' : ''}`}>
          {productsToShow.map((product) => (
            <div
              key={product.id}
              className="self-stretch py-2 border-b border-gray-200 flex justify-start items-center gap-12 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleProduct}
            >
              <div className="flex-1 flex justify-start items-center gap-3">
                <AvatarImage
                  src={product.image}
                  alt={product.title}
                  fallbackText={product.title.split(' ').map(n => n[0]).join('').toUpperCase()}
                />
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="text-black text-sm font-semibold leading-normal">
                    {product.title}
                  </div>
                  <div className="self-stretch text-gray-500 text-xs font-medium leading-tight">
                    {product.category}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-purple-600 text-sm font-semibold">
                    {product.totalClicks}
                  </div>
                  <div className="text-gray-400 text-xs">
                    clicks
                  </div>
                </div>
              </div>
            </div>
          ))}
          {productsToShow.length === 0 && (
            <div className="self-stretch py-4 text-center text-gray-500 text-sm">
              No recent products
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentSubscribersAndProducts;