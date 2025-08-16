'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome to the admin panel.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Manage Trips</h2>
          <p className="mt-2 text-gray-600">Create, edit, and delete upcoming trips. Set prices and travel dates.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Manage Articles</h2>
          <p className="mt-2 text-gray-600">Write and publish articles for the main page blog.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Update Settings</h2>
          <p className="mt-2 text-gray-600">Change site-wide information like contact details.</p>
        </div>
      </div>
    </div>
  );
}
