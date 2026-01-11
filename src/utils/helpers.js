/**
 * Helper functions for WalletLog application
 */

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Current date string
 */
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate the difference between two dates in days
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {number} - Number of days between the dates
 */
export const dateDiffInDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Validate if a value is a positive number
 * @param {any} value - Value to validate
 * @returns {boolean} - True if value is a positive number
 */
export const isValidPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Generate a unique ID
 * @returns {string} - Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Filter transactions by date period
 * @param {Array} transactions - Array of transaction objects
 * @param {string} period - Period to filter by ('week', 'month', 'year')
 * @returns {Array} - Filtered transactions
 */
export const filterTransactionsByPeriod = (transactions, period) => {
  const now = new Date();
  const filtered = [...transactions];
  
  switch(period) {
    case 'week':
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return filtered.filter(t => new Date(t.date) >= oneWeekAgo);
    
    case 'month':
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return filtered.filter(t => new Date(t.date) >= oneMonthAgo);
    
    case 'year':
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return filtered.filter(t => new Date(t.date) >= oneYearAgo);
    
    default:
      return filtered;
  }
};