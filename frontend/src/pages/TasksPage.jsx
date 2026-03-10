import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskManager/TaskForm';
import TaskList from '../components/TaskManager/TaskList';
import TaskSearch from '../components/TaskManager/TaskSearch';
import Pagination from '../components/common/Pagination';
import { tasksApi } from '../services/api';
import { PAGINATION, TASK_STATUS } from '../services/config';
import { FaTasks, FaChartPie, FaClock, FaCheckCircle } from 'react-icons/fa';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    completed: 0
  });

  const fetchTasks = async (page = pagination.page, search = searchTerm) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        search
      };
      const response = await tasksApi.getAll(params);
      const fetchedTasks = response.data.tasks;
      setTasks(fetchedTasks);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });

      // Calculate stats
      const newStats = {
        total: response.data.total,
        pending: fetchedTasks.filter(t => t.status === TASK_STATUS.PENDING).length,
        ongoing: fetchedTasks.filter(t => t.status === TASK_STATUS.ONGOING).length,
        completed: fetchedTasks.filter(t => t.status === TASK_STATUS.COMPLETED).length
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      await tasksApi.create(taskData);
      fetchTasks(1, searchTerm);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await tasksApi.update(id, taskData);
      setEditingTask(null);
      fetchTasks(pagination.page, searchTerm);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(id);
        fetchTasks(pagination.page, searchTerm);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await tasksApi.markCompleted(id);
      fetchTasks(pagination.page, searchTerm);
    } catch (error) {
      console.error('Error marking task as completed:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchTasks(1, term);
  };

  const handlePageChange = (newPage) => {
    fetchTasks(newPage, searchTerm);
  };

  const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 
                    transition-all duration-300 hover:shadow-xl group
                    border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} 
                      flex items-center justify-center shadow-lg
                      group-hover:rotate-12 transition-transform duration-500`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${gradient} 
                    transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header with gradient */}
        <div className="relative mb-8 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 
                        rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 
                        rounded-3xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
                <FaTasks className="text-3xl" />
                <span>Task Manager</span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                Organize, track, and manage your daily tasks efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <StatCard 
            icon={FaTasks}
            label="Total Tasks"
            value={stats.total}
            gradient="from-primary-500 to-primary-600"
          />
          <StatCard 
            icon={FaClock}
            label="Pending"
            value={stats.pending}
            gradient="from-yellow-500 to-yellow-600"
          />
          <StatCard 
            icon={FaChartPie}
            label="Ongoing"
            value={stats.ongoing}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard 
            icon={FaCheckCircle}
            label="Completed"
            value={stats.completed}
            gradient="from-green-500 to-green-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 animate-slide-in">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              initialData={editingTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>

          {/* Right Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <TaskSearch onSearch={handleSearch} />
            
            <TaskList
              tasks={tasks}
              loading={loading}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onMarkCompleted={handleMarkCompleted}
            />
            
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;