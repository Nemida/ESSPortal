import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// Create socket connection
const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Log connection status
socket.on('connect', () => {
  console.log('🔌 Connected to server');
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from server');
});

/**
 * Hook to listen for socket events
 * @param {string} event - Event name to listen for
 * @param {function} callback - Callback to execute when event is received
 */
export const useSocket = (event, callback) => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    socket.on(event, memoizedCallback);
    
    return () => {
      socket.off(event, memoizedCallback);
    };
  }, [event, memoizedCallback]);
};

/**
 * Hook to auto-refresh data when a specific data type is updated
 * @param {string} dataType - Type of data to watch (e.g., 'announcements', 'events')
 * @param {function} fetchFunction - Function to call to refresh data
 */
export const useAutoRefresh = (dataType, fetchFunction) => {
  useSocket('data-updated', (data) => {
    if (data.type === dataType) {
      console.log(`🔄 Auto-refreshing ${dataType}`);
      fetchFunction();
    }
  });
};

export default socket;
