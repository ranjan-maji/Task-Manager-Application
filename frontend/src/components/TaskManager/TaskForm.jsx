import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaSave, FaEdit, FaTag, FaAlignLeft, FaList, FaExclamationCircle, FaAsterisk } from 'react-icons/fa';
import { TASK_STATUS } from '../../services/config';

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING
  });
  const [isFocused, setIsFocused] = useState({
    title: false,
    description: false,
    status: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || TASK_STATUS.PENDING
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
    switch(name) {
      case 'title':
        if (!value || value.trim() === '') {
          return 'Title is required';
        }
        if (value.length < 3) {
          return 'Title must be at least 3 characters';
        }
        if (value.length > 100) {
          return 'Title must be less than 100 characters';
        }
        return '';
      case 'description':
        if (value && value.length > 500) {
          return 'Description must be less than 500 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      status: true
    });

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-300');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Make sure we have a valid ID
        const taskId = initialData.id || initialData._id;
        if (!taskId) {
          console.error('No valid ID found for task:', initialData);
          setErrors({ form: 'Invalid task data: missing ID' });
          setIsSubmitting(false);
          return;
        }
        await onSubmit(taskId, formData);
      } else {
        await onSubmit(formData);
      }
      
      // Reset form only for new tasks
      if (!initialData) {
        setFormData({ title: '', description: '', status: TASK_STATUS.PENDING });
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ form: error.message || 'Failed to save task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case TASK_STATUS.PENDING:
        return 'from-yellow-500 to-yellow-600';
      case TASK_STATUS.ONGOING:
        return 'from-blue-500 to-blue-600';
      case TASK_STATUS.COMPLETED:
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case TASK_STATUS.PENDING:
        return '⏳';
      case TASK_STATUS.ONGOING:
        return '🔄';
      case TASK_STATUS.COMPLETED:
        return '✅';
      default:
        return '📋';
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return formData.title && formData.title.trim().length >= 3;
  };

  return (
    <div className="card-modern relative overflow-hidden group animate-slide-up">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/10 to-primary-600/5 rounded-full blur-3xl translate-y-32 -translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        {/* Header with gradient */}
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getStatusColor(formData.status)} 
                         flex items-center justify-center shadow-xl transform group-hover:rotate-12 
                         transition-all duration-500 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
            {initialData ? (
              <FaEdit className="text-white text-2xl relative z-10" />
            ) : (
              <FaPlus className="text-white text-2xl relative z-10" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {initialData ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
              <span>{initialData ? 'Update your task details below' : 'Fill in the details to create a new task'}</span>
            </p>
          </div>
        </div>

        {/* Required Fields Notice - Enhanced */}
        <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border border-primary-200">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaAsterisk className="text-white text-xs" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-800">
                <span className="text-red-500 text-lg mr-1">*</span> 
                <span className="font-bold">Required Fields</span>
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Fields marked with <span className="text-red-500 font-bold">*</span> must be filled before submitting
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${formData.title ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className={formData.title ? 'text-green-600' : 'text-red-500'}>
                    Title {formData.title ? '✓' : '(required)'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${formData.description ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={formData.description ? 'text-green-600' : 'text-gray-500'}>
                    Description (optional)
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-600">Status (optional)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Error */}
        {errors.form && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-600 animate-shake">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationCircle className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-xs">{errors.form}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input - Required */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.title && touched.title ? 'text-red-500' : isFocused.title || formData.title ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaTag className="text-xs" />
              <span>Task Title</span>
              <span className="text-red-500 text-lg leading-none">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, title: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, title: false});
                  handleBlur('title');
                }}
                required
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400
                         ${errors.title && touched.title 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : formData.title 
                             ? 'border-green-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300' 
                             : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="e.g., Complete project presentation"
                disabled={isSubmitting}
              />
              {errors.title && touched.title && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in flex items-center space-x-1">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.title}</span>
                </p>
              )}
              {!errors.title && formData.title && (
                <p className="absolute -bottom-5 left-0 text-xs text-green-500 animate-fade-in flex items-center space-x-1">
                  <span>✓</span>
                  <span>Looks good!</span>
                </p>
              )}
            </div>
          </div>

          {/* Description Input - Optional */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.description && touched.description ? 'text-red-500' : isFocused.description || formData.description ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaAlignLeft className="text-xs" />
              <span>Description</span>
              <span className="text-gray-400 text-xs ml-1">(optional)</span>
            </label>
            <div className="relative group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, description: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, description: false});
                  handleBlur('description');
                }}
                rows="4"
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400 resize-none
                         ${errors.description && touched.description 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="Describe your task in detail... (optional)"
                disabled={isSubmitting}
              />
              {errors.description && touched.description && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in">
                  {errors.description}
                </p>
              )}
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
                {formData.description.length}/500
              </div>
            </div>
          </div>

          {/* Status Select - Optional */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${isFocused.status || formData.status ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaList className="text-xs" />
              <span>Status</span>
              <span className="text-gray-400 text-xs ml-1">(optional)</span>
            </label>
            <div className="relative group">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, status: true})}
                onBlur={() => setIsFocused({...isFocused, status: false})}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl
                         focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                         transition-all duration-300 text-gray-700 appearance-none cursor-pointer
                         group-hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <option value={TASK_STATUS.PENDING}>⏳ Pending</option>
                <option value={TASK_STATUS.ONGOING}>🔄 Ongoing</option>
                <option value={TASK_STATUS.COMPLETED}>✅ Completed</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className={`w-5 h-5 ${isFocused.status ? 'text-primary-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Current Status Preview */}
          {formData.status && (
            <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl animate-fade-in border border-gray-200">
              <span className="text-sm text-gray-600">Current status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${formData.status === TASK_STATUS.PENDING ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : ''}
                ${formData.status === TASK_STATUS.ONGOING ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                ${formData.status === TASK_STATUS.COMPLETED ? 'bg-green-100 text-green-700 border border-green-200' : ''}
              `}>
                {getStatusIcon(formData.status)} {formData.status}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-white
                       transform hover:scale-105 transition-all duration-300
                       focus:ring-4 focus:ring-primary-300 focus:outline-none
                       flex items-center justify-center space-x-2 group
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       ${isFormValid() 
                         ? `bg-gradient-to-r ${getStatusColor(formData.status)} hover:shadow-xl` 
                         : 'bg-gradient-to-r from-gray-400 to-gray-500'
                       }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{initialData ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  {initialData ? (
                    <>
                      <FaSave className="group-hover:rotate-12 transition-transform duration-300" />
                      <span>Update Task</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Create Task</span>
                    </>
                  )}
                </>
              )}
            </button>
            
            {initialData && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl
                         hover:bg-gray-200 transform hover:scale-105 transition-all duration-300
                         focus:ring-4 focus:ring-gray-300 focus:outline-none
                         flex items-center space-x-2 group
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          {/* Form Footer with Enhanced Required Fields Info */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-red-500 font-bold text-sm">*</span>
                  <span className="text-gray-500">Required field</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-500">Field completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-500">Missing required</span>
                </div>
              </div>
              <div className={`font-medium ${isFormValid() ? 'text-green-600' : 'text-red-500'}`}>
                {isFormValid() ? '✓ Ready to submit' : '⚠️ Complete required fields'}
              </div>
            </div>
          </div>
        </form>

        {/* Status indicator bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusColor(formData.status)} 
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left
                      ${isSubmitting ? 'animate-pulse' : ''}`}>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;