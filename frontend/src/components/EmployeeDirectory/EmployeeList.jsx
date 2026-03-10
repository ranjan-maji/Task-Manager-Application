import React from 'react';
import EmployeeItem from './EmployeeItem';
import { FaUsers } from 'react-icons/fa';

const EmployeeList = ({ employees, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="card-modern animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="card-modern text-center py-16 animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 
                        flex items-center justify-center shadow-xl floating">
            <FaUsers className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">No Employees Found</h3>
          <p className="text-gray-500 max-w-sm">
            {employees.length === 0 
              ? "You haven't added any employees yet. Click the 'Add Employee' button to get started!" 
              : "No employees match your search criteria."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {employees.map((employee, index) => {
        const employeeId = employee.id || employee._id;
        
        if (!employeeId) {
          console.warn('Employee without ID:', employee);
          return null;
        }
        
        return (
          <div key={employeeId} style={{ animationDelay: `${index * 100}ms` }}>
            <EmployeeItem
              employee={employee}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeList;