import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/events');

    eventSource.onmessage = (e) => {
      const { message } = JSON.parse(e.data);
      toast.success(message); 
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleClick = async () => {
    await fetch('http://localhost:5000/trigger-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "You clicked the button!" })
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>SSE Demo with Button</h2>
      <button onClick={handleClick}>Trigger Notification</button>
      <ToastContainer />
    </div>
  );
};

export default App;
