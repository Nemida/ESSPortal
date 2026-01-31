import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});

export const useSocket = (event, callback) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (data) => callbackRef.current(data);
    socket.on(event, handler);
    
    return () => {
      socket.off(event, handler);
    };
  }, [event]);
};

export const useAutoRefresh = (dataType, fetchFunction) => {
  const fetchRef = useRef(fetchFunction);
  
  useEffect(() => {
    fetchRef.current = fetchFunction;
  }, [fetchFunction]);

  useEffect(() => {
    const handler = (data) => {
      if (data.type === dataType) {
        fetchRef.current();
      }
    };
    
    socket.on('data-updated', handler);
    
    return () => {
      socket.off('data-updated', handler);
    };
  }, [dataType]);
};

// Export socket instance for direct access if needed
export { socket };

export default socket;
