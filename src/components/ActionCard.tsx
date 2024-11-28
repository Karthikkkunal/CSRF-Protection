import React from 'react';
import { Shield, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import type { RequestStatus } from '../types/api';

interface ActionCardProps {
  title: string;
  description: string;
  onAction: () => Promise<void>;
  protected?: boolean;
  result?: string;
  status: RequestStatus;
}

export function ActionCard({
  title,
  description,
  onAction,
  protected: isProtected = false,
  result,
  status
}: ActionCardProps) {
  const Icon = isProtected ? Shield : ShieldAlert;
  const colorClass = isProtected ? 'indigo' : 'yellow';

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Icon className={`h-6 w-6 text-${colorClass}-500 mr-2`} />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={onAction}
        disabled={status.loading}
        className={`w-full bg-${colorClass}-600 text-white px-4 py-2 rounded-md hover:bg-${colorClass}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
      >
        {status.loading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : null}
        {status.loading ? 'Processing...' : `Try ${title}`}
      </button>
      {result && status.success && (
        <div className={`mt-4 flex items-center text-${colorClass}-600`}>
          <CheckCircle className="h-5 w-5 mr-2" />
          {result}
        </div>
      )}
    </div>
  );
}