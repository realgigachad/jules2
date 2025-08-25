/**
 * @fileoverview This file defines the LoadingSpinner component, a simple animated
 * spinner to indicate a loading state.
 */

/**
 * A presentational component that renders a spinning loading indicator.
 * It uses Tailwind CSS for styling and animation.
 * @returns {JSX.Element} The rendered loading spinner.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );
}
