import React from 'react';
import TaskItem from './TaskItem';
import { FaTasks } from 'react-icons/fa';

const TaskList = ({ tasks, loading, onEdit, onDelete, onMarkCompleted }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="card-modern animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card-modern text-center py-16 animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 
                        flex items-center justify-center shadow-xl floating">
            <FaTasks className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">No Tasks Found</h3>
          <p className="text-gray-500 max-w-sm">
            You haven't created any tasks yet. Click the 'Create New Task' button to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {tasks.map((task, index) => {
        // Ensure we have a valid ID
        const taskId = task.id || task._id;
        
        if (!taskId) {
          console.warn('Task without ID:', task);
          return null;
        }
        
        return (
          <div key={taskId} style={{ animationDelay: `${index * 100}ms` }}>
            <TaskItem
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkCompleted={onMarkCompleted}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;