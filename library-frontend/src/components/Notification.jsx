import { useEffect } from 'react';

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    if (!notification) return;

    const timeoutID = setTimeout(() => {
      setNotification('');
    }, 5000);

    return () => clearTimeout(timeoutID);
  }, [notification, setNotification]);

  if (!notification) {
    return null;
  }

  return <div style={{ color: 'red' }}>{notification}</div>;
};

export default Notification;
