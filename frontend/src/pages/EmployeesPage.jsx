import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeDirectory/EmployeeForm';
import EmployeeList from '../components/EmployeeDirectory/EmployeeList';
import EmployeeSearch from '../components/EmployeeDirectory/EmployeeSearch';
import Pagination from '../components/common/Pagination';
import { employeesApi } from '../services/api';
import { PAGINATION } from '../services/config';
import { FaUsers, FaUserPlus, FaBuilding, FaEnvelope } from 'react-icons/fa';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    byDepartment: {}
  });

  const fetchEmployees = async (page = pagination.page, email = searchEmail, department = departmentFilter) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        email,
        department
      };
      const response = await employeesApi.getAll(params);
      const fetchedEmployees = response.data.employees;
      setEmployees(fetchedEmployees);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });

      // Calculate stats
      const deptStats = {};
      fetchedEmployees.forEach(emp => {
        deptStats[emp.department] = (deptStats[emp.department] || 0) + 1;
      });
      
      setStats({
        total: response.data.total,
        byDepartment: deptStats
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      await employeesApi.create(employeeData);
      fetchEmployees(1, searchEmail, departmentFilter);
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error; // Re-throw to be handled by form
    }
  };

  const handleUpdateEmployee = async (id, employeeData) => {
    try {
      await employeesApi.update(id, employeeData);
      setEditingEmployee(null);
      fetchEmployees(pagination.page, searchEmail, departmentFilter);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error; // Re-throw to be handled by form
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeesApi.delete(id);
        fetchEmployees(pagination.page, searchEmail, departmentFilter);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleSearch = (email) => {
    setSearchEmail(email);
    fetchEmployees(1, email, departmentFilter);
  };

  const handleDepartmentFilter = (department) => {
    setDepartmentFilter(department);
    fetchEmployees(1, searchEmail, department);
  };

  const handlePageChange = (newPage) => {
    fetchEmployees(newPage, searchEmail, departmentFilter);
  };

  const StatCard = ({ icon: Icon, label, value, gradient, color }) => (
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
                <FaUsers className="text-3xl" />
                <span>Employee Directory</span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                Manage and organize your team members efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <StatCard 
            icon={FaUsers}
            label="Total Employees"
            value={stats.total}
            gradient="from-primary-500 to-primary-600"
          />
          <StatCard 
            icon={FaUserPlus}
            label="Active"
            value={stats.total}
            gradient="from-green-500 to-green-600"
          />
          <StatCard 
            icon={FaBuilding}
            label="Departments"
            value={Object.keys(stats.byDepartment).length}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard 
            icon={FaEnvelope}
            label="With Email"
            value={stats.total}
            gradient="from-blue-500 to-blue-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1 animate-slide-in">
            <EmployeeForm
              onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              initialData={editingEmployee}
              onCancel={() => setEditingEmployee(null)}
            />
          </div>

          {/* Right Column - Employees */}
          <div className="lg:col-span-2 space-y-6">
            <EmployeeSearch
              onSearch={handleSearch}
              onFilter={handleDepartmentFilter}
              currentFilter={departmentFilter}
            />
            
            <EmployeeList
              employees={employees}
              loading={loading}
              onEdit={setEditingEmployee}
              onDelete={handleDeleteEmployee}
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

export default EmployeesPage;