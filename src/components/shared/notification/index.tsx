import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-700 flex items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      {message}
    </div>
  );
};

export default Notification;