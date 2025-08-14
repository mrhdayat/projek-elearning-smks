// src/utils/errorHandler.js
// Utility untuk menangani error dan debugging

export const logError = (error, context = '') => {
  console.error(`[ERROR] ${context}:`, error);
  
  // Dalam production, kirim ke service logging
  if (process.env.NODE_ENV === 'production') {
    // Implementasi logging service
    // sendToLoggingService(error, context);
  }
};

export const handleAsyncError = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      logError(error, asyncFn.name);
      throw error;
    }
  };
};

export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError(error, 'JSON Parse');
    return fallback;
  }
};

export const validateIconImport = (iconName) => {
  // Daftar icon yang CONFIRMED WORKING dari react-icons/lu
  const validIcons = [
    'LuUsers', 'LuTrendingUp', 'LuDownload', 'LuFilter', 'LuActivity',
    'LuSearch', 'LuBell', 'LuX', 'LuCheck', 'LuClock', 'LuFileText',
    'LuMessageCircle', 'LuAward', 'LuCalendar', 'LuBookOpen',
    'LuClipboardCheck', 'LuAlertCircle', 'LuGraduationCap',
    'LuAlertTriangle', 'LuTrendingDown', 'LuHeart', 'LuUpload', 'LuEye',
    'LuArrowLeft', 'LuArrowRight', 'LuPin', 'LuReply', 'LuThumbsUp',
    'LuUser', 'LuConstruction', 'LuRefreshCw', 'LuPlus',
    // Additional confirmed icons
    'LuChevronDown', 'LuLogOut', 'LuCheckCircle', 'LuMapPin', 'LuSave'
  ];

  // Daftar icon yang TIDAK tersedia (confirmed)
  const invalidIcons = [
    'LuBarChart3', 'LuBarChart', 'LuChart', 'LuBarChart2', 'LuPieChart'
  ];

  if (invalidIcons.includes(iconName)) {
    console.error(`❌ Icon ${iconName} is NOT available in react-icons/lu. Use LuActivity or LuTrendingUp instead.`);
    return false;
  }

  if (!validIcons.includes(iconName)) {
    console.warn(`⚠️ Icon ${iconName} might not be available in react-icons/lu`);
    return false;
  }
  return true;
};

export const debugComponent = (componentName, props = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${componentName}:`, props);
  }
};

export default {
  logError,
  handleAsyncError,
  safeJsonParse,
  validateIconImport,
  debugComponent
};
