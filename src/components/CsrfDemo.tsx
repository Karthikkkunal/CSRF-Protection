import React, { useState } from 'react';
import { Shield, XCircle, RefreshCw } from 'lucide-react';
import { performProtectedAction, performUnprotectedAction } from '../services/api';
import { useCsrfToken } from '../hooks/useCsrfToken';
import { ActionCard } from './ActionCard';
import type { RequestStatus } from '../types/api';

export function CsrfDemo() {
  const { token, status: tokenStatus, refreshToken } = useCsrfToken();
  const [protectedStatus, setProtectedStatus] = useState<RequestStatus>({
    loading: false,
    error: null,
    success: false
  });
  const [unprotectedStatus, setUnprotectedStatus] = useState<RequestStatus>({
    loading: false,
    error: null,
    success: false
  });
  const [protectedResult, setProtectedResult] = useState<string>('');
  const [unprotectedResult, setUnprotectedResult] = useState<string>('');

  const handleProtectedAction = async () => {
    setProtectedStatus({ loading: true, error: null, success: false });
    try {
      const response = await performProtectedAction(token);
      setProtectedResult(response.data.message);
      setProtectedStatus({ loading: false, error: null, success: true });
    } catch (err) {
      setProtectedStatus({
        loading: false,
        error: 'Protected action failed',
        success: false
      });
    }
  };

  const handleUnprotectedAction = async () => {
    setUnprotectedStatus({ loading: true, error: null, success: false });
    try {
      const response = await performUnprotectedAction();
      setUnprotectedResult(response.data.message);
      setUnprotectedStatus({ loading: false, error: null, success: true });
    } catch (err) {
      setUnprotectedStatus({
        loading: false,
        error: 'Unprotected action failed',
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
            CSRF Protection Demo
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore how CSRF protection works in a real application
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current CSRF Token</h2>
            <button
              onClick={refreshToken}
              disabled={tokenStatus.loading}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${tokenStatus.loading ? 'animate-spin' : ''}`} />
              Refresh Token
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <code className="text-sm break-all">
              {tokenStatus.loading ? 'Loading...' : token}
            </code>
          </div>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <ActionCard
            title="Protected Action"
            description="This action is protected by CSRF token verification"
            onAction={handleProtectedAction}
            protected={true}
            result={protectedResult}
            status={protectedStatus}
          />

          <ActionCard
            title="Unprotected Action"
            description="This action has no CSRF protection"
            onAction={handleUnprotectedAction}
            protected={false}
            result={unprotectedResult}
            status={unprotectedStatus}
          />
        </div>

        {(tokenStatus.error || protectedStatus.error || unprotectedStatus.error) && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">
                {tokenStatus.error || protectedStatus.error || unprotectedStatus.error}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}