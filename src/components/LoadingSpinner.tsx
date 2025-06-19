import type { LoadingSpinnerProps } from "../../types/types";

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = 'md',
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-neutral-dark mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
} 