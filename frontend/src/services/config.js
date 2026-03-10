export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TASK_STATUS = {
  PENDING: 'pending',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.ONGOING]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10
};