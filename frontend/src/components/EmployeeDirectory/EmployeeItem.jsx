import React, { useState } from 'react';
import { FaEdit, FaTrash, FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const EmployeeItem = ({ employee, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safely get employee ID
  const employeeId = employee.id || employee._id;

  const handleEdit = () => {
    if (employeeId && onEdit) {
      onEdit(employee);
    }
  };

  const handleDelete = () => {
    if (employeeId && onDelete) {
      onDelete(employeeId);
    }
  };

  // Don't render if no valid ID
  if (!employeeId) {
    console.warn('EmployeeItem rendered without valid ID:', employee);
    return null;
  }

  return (
    <div 
      className={`group relative card-modern overflow-hidden transform transition-all duration-500
                 hover:scale-[1.02] hover:shadow-2xl animate-fade-in
                 ${isHovered ? 'shadow-2xl' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 opacity-5 
                    rounded-full blur-2xl transform transition-all duration-700
                    ${isHovered ? 'scale-150 opacity-10' : ''}">
      </div>

      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          {/* Profile Image */}
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 
                          border-4 border-white shadow-xl transform group-hover:rotate-3 transition-all duration-500">
              {employee.image && !imageError ? (
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            {/* Department indicator dot */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white
                          ${employee.department === 'Engineering' ? 'bg-blue-500' : ''}
                          ${employee.department === 'Marketing' ? 'bg-purple-500' : ''}
                          ${employee.department === 'Sales' ? 'bg-green-500' : ''}
                          ${employee.department === 'Human Resources' ? 'bg-pink-500' : ''}
                          ${employee.department === 'Finance' ? 'bg-yellow-500' : ''}
                          ${employee.department === 'Operations' ? 'bg-orange-500' : ''}
                          ${employee.department === 'Customer Support' ? 'bg-teal-500' : ''}
                          ${employee.department === 'Product' ? 'bg-indigo-500' : ''}
                          ${employee.department === 'Design' ? 'bg-rose-500' : ''}
                          shadow-lg animate-pulse`}>
            </div>
          </div>
          
          <div className="flex-1">
            {/* Header with name and actions */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {employee.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center space-x-1 mt-0.5">
                  <FaEnvelope className="text-xs" />
                  <span>{employee.email}</span>
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FaEllipsisV className="text-gray-500" />
                </button>

                <div className={`hidden md:flex items-center space-x-2 transition-all duration-300
                              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-2'}`}>
                  <button
                    onClick={handleEdit}
                    className="btn-icon bg-blue-500 text-white hover:bg-blue-600
                             hover:shadow-lg hover:shadow-blue-500/30
                             transform hover:scale-110 transition-all duration-300
                             focus:ring-4 focus:ring-blue-300"
                    title="Edit employee"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-icon bg-red-500 text-white hover:bg-red-600
                             hover:shadow-lg hover:shadow-red-500/30
                             transform hover:scale-110 transition-all duration-300
                             focus:ring-4 focus:ring-red-300"
                    title="Delete employee"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="mt-3 space-y-2">
              {employee.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 group/item">
                  <FaPhone className="text-gray-400 group-hover/item:text-primary-500 transition-colors" />
                  <span>{employee.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 group/item">
                <FaBuilding className="text-gray-400 group-hover/item:text-primary-500 transition-colors" />
                <span className="font-medium">{employee.department}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-400 group/item">
                <FaCalendarAlt className="group-hover/item:text-primary-500 transition-colors" />
                <span>Joined {formatDistanceToNow(new Date(employee.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Tags/Additional Info */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                {employee.department}
              </span>
              {employee.phone && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                  Contact available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        {showActions && (
          <div className="md:hidden flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 animate-slide-up">
            <button
              onClick={() => {
                handleEdit();
                setShowActions(false);
              }}
              className="flex-1 py-2 bg-blue-500 text-white rounded-xl font-medium
                       hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowActions(false);
              }}
              className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium
                       hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeItem;