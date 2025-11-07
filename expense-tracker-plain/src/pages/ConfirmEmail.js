// src/pages/ConfirmEmail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const ConfirmEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { data } = await API.get(`/auth/confirm/${token}`);
        setMessage(data.message);
      } catch (err) {
        setMessage(err.response?.data?.error || 'Confirmation failed');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Email Confirmation</h2>
        {loading ? (
          <p>Confirming your email...</p>
        ) : (
          <div>
            <p className={message.includes('success') ? 'text-green-600' : 'text-red-600'}>
              {message}
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;