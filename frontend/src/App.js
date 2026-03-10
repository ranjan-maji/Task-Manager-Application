import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Navbar from './components/common/Navbar';
import TasksPage from './pages/TasksPage';
import EmployeesPage from './pages/EmployeesPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;