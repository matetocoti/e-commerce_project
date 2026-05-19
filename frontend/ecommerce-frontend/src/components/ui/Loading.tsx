


interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  minHeight?: string;
  maxWidth?: string;
  showSpinner?: boolean;
  fullScreen?: boolean;
  spinnerColor?: string;
}

const sizeConfig = {
  sm: {
    spinner: 'h-6 w-6 border-2',
    message: 'text-sm'
  },
  md: {
    spinner: 'h-8 w-8 border-4',
    message: 'text-base'
  },
  lg: {
    spinner: 'h-12 w-12 border-4',
    message: 'text-lg'
  }
};

const colorClasses: Record<string, string> = {
  blue: 'border-blue-600',
  red: 'border-red-600',
  green: 'border-green-600',
  purple: 'border-purple-600',
  gray: 'border-gray-600',
  indigo: 'border-indigo-600',
  yellow: 'border-yellow-600'
};

export function Loading({
  message,
  size = 'md',
  minHeight = 'h-64',
  maxWidth = 'max-w-2xl',
  showSpinner = true,
  fullScreen = false,
  spinnerColor = 'blue'
}: Readonly<LoadingProps>) {
  const config = sizeConfig[size];
  const borderColor = colorClasses[spinnerColor] || colorClasses.blue;

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/50 z-50'
    : `mx-auto flex ${minHeight} flex-col items-center justify-center ${maxWidth} px-4 py-10`;

  return (
    <div className={containerClasses}>
      {showSpinner && (
        <div
          className={`${config.spinner} animate-spin rounded-full ${borderColor} border-t-transparent`}
        ></div>
      )}
      {message && (
        <p className={`mt-4 text-gray-500 ${config.message}`}>
          {message}
        </p>
      )}
    </div>
  );
}
    