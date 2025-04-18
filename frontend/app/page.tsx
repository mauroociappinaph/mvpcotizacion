'use client';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Tasks Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-green-600">0</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-red-600">0</p>
                  <p className="text-sm text-gray-500">Overdue</p>
                </div>
              </div>
            </div>

            {/* Projects Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">Projects</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Total Projects</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-green-600">0</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-yellow-600">0</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
            </div>

            {/* Team Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-gray-900">Team</h2>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-semibold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Team Members</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-blue-600">0</p>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <div className="mt-4">
              <p className="text-gray-500">No recent activity.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
