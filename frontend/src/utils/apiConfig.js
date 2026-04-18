/**
 * Centralized API configuration
 * Prevents duplication of API_URL constant across components
 */
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
