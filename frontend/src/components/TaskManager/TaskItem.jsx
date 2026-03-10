import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaClock, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';
import { TASK_STATUS } from '../../services/config';
import { formatDistanceToNow } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete, onMarkCompleted }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Safely get task ID
  const taskId = task.id || task._id;

  const getStatusStyles = () => {
    switch(task.status) {
      case TASK_STATUS.PENDING:
        return {
          bg: 'from-yellow-500 to-yellow-600',
          light: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: '⏳'
        };
      case TASK_STATUS.ONGOING:
        return {
          bg: 'from-blue-500 to-blue-600',
          light: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: '🔄'
        };
      case TASK_STATUS.COMPLETED:
        return {
          bg: 'from-green-500 to-green-600',
          light: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: '✅'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          light: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: '📋'
        };
    }
  };

  const styles = getStatusStyles();

  const handleEdit = () => {
    if (taskId && onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    if (taskId && onDelete) {
      onDelete(taskId);
    }
  };

  const handleMarkComplete = () => {
    if (taskId && onMarkCompleted) {
      onMarkCompleted(taskId);
    }
  };

  // Don't render if no valid ID
  if (!taskId) {
    console.warn('TaskItem rendered without valid ID:', task);
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
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${styles.bg} 
                    transform origin-left transition-transform duration-500
                    ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}>
      </div>

      {/* Decorative background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${styles.bg} opacity-5 
                    rounded-full blur-2xl transform transition-all duration-700
                    ${isHovered ? 'scale-150 opacity-10' : ''}`}>
      </div>

      <div className="relative z-10">
        {/* Header with title and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${styles.bg} 
                            flex items-center justify-center shadow-lg transform 
                            group-hover:rotate-12 transition-all duration-500`}>
                <span className="text-white text-lg">{styles.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
            </div>
            
            {/* Status badge */}
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.light} ${styles.text} border ${styles.border}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              {task.status === TASK_STATUS.COMPLETED && (
                <span className="text-green-500 animate-pulse">✨</span>
              )}
            </div>
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
              {task.status !== TASK_STATUS.COMPLETED && (
                <button
                  onClick={handleMarkComplete}
                  className="btn-icon bg-green-500 text-white hover:bg-green-600 
                           hover:shadow-lg hover:shadow-green-500/30
                           transform hover:scale-110 transition-all duration-300
                           focus:ring-4 focus:ring-green-300"
                  title="Mark as completed"
                >
                  <FaCheckCircle />
                </button>
              )}
              <button
                onClick={handleEdit}
                className="btn-icon bg-blue-500 text-white hover:bg-blue-600
                         hover:shadow-lg hover:shadow-blue-500/30
                         transform hover:scale-110 transition-all duration-300
                         focus:ring-4 focus:ring-blue-300"
                title="Edit task"
              >
                <FaEdit />
              </button>
              <button
                onClick={handleDelete}
                className="btn-icon bg-red-500 text-white hover:bg-red-600
                         hover:shadow-lg hover:shadow-red-500/30
                         transform hover:scale-110 transition-all duration-300
                         focus:ring-4 focus:ring-red-300"
                title="Delete task"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 mb-4 pl-14 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Timestamps */}
        <div className="flex items-center space-x-4 pl-14 text-sm text-gray-500">
          <div className="flex items-center space-x-1 group">
            <FaCalendarAlt className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span>Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
          </div>
          {task.updated_at && task.updated_at !== task.created_at && (
            <div className="flex items-center space-x-1 group">
              <FaClock className="text-gray-400 group-hover:text-primary-500 transition-colors" />
              <span>Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>

        {/* Progress bar for ongoing tasks */}
        {task.status === TASK_STATUS.ONGOING && (
          <div className="mt-4 pl-14">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    50%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100">
                <div style={{ width: "50%" }} 
                     className="shadow-none flex flex-col text-center whitespace-nowrap 
                              text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600
                              animate-pulse-slow">
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile action buttons */}
        {showActions && (
          <div className="md:hidden flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 animate-slide-up">
            {task.status !== TASK_STATUS.COMPLETED && (
              <button
                onClick={() => {
                  handleMarkComplete();
                  setShowActions(false);
                }}
                className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium
                         hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FaCheckCircle />
                <span>Complete</span>
              </button>
            )}
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

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.bg} opacity-0 
                    group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}>
      </div>
    </div>
  );
};

export default TaskItem;