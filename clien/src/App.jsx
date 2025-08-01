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
    <>
      <div className='h-screen w-screen bg-zinc-900 text-5xl text-white'>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 w-screen">
          <div className="bg-zinc-950 rounded-xl shadow-lg p-8 flex flex-col items-center space-y-6">
            <h2 className="text-white text-2xl font-semibold mb-2">SSE Demo with Button</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-medium shadow"
              onClick={handleClick}
            >
              Trigger Notification
            </button>
          </div>
          <ToastContainer position="top-center" />
        </div>
      </div>
    </>
  );
};

export default App;
