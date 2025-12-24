import React from 'react';

const Pagination = ({ 
  currentPage, 
  nextPage, 
  previousPage, 
  onNextPage, 
  onPreviousPage 
}) => {
  if (!nextPage && !previousPage) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={onPreviousPage}
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
        onClick={onNextPage}
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
  );
};

export default Pagination;