import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserEdit, FaUser, FaEnvelope, FaPhone, FaBuilding, FaImage, FaTimes, FaSave, FaExclamationCircle, FaAsterisk, FaCheckCircle } from 'react-icons/fa';

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
  'Design'
];

const EmployeeForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    image: ''
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    phone: false,
    department: false,
    image: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || '',
        image: initialData.image || ''
      });
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const validateField = (name, value) => {
    switch(name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Name is required';
        }
        if (value.length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.length > 50) {
          return 'Name must be less than 50 characters';
        }
        return '';
      
      case 'email':
        if (!value || value.trim() === '') {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      
      case 'phone':
        if (value && value.trim() !== '') {
          const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
          if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number';
          }
        }
        return '';
      
      case 'department':
        if (!value || value.trim() === '') {
          return 'Department is required';
        }
        return '';
      
      case 'image':
        if (value && value.trim() !== '') {
          try {
            new URL(value);
          } catch {
            return 'Please enter a valid URL';
          }
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    ['name', 'email', 'department'].forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    // Validate optional fields if they have values
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }
    
    if (formData.image) {
      const imageError = validateField('image', formData.image);
      if (imageError) newErrors.image = imageError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    setTouched({
      name: true,
      email: true,
      department: true,
      phone: true,
      image: true
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
        const employeeId = initialData.id || initialData._id;
        if (!employeeId) {
          console.error('No valid ID found for employee:', initialData);
          setErrors({ form: 'Invalid employee data: missing ID' });
          setIsSubmitting(false);
          return;
        }
        await onSubmit(employeeId, formData);
      } else {
        await onSubmit(formData);
      }
      
      // Reset form only for new employees
      if (!initialData) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          image: ''
        });
        setImagePreview(null);
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('email')) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ form: error.response?.data?.message || 'Failed to save employee. Please try again.' });
      }
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

    // Handle image preview
    if (name === 'image') {
      setImagePreview(value || null);
    }

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

  // Check if all required fields are filled
  const isFormValid = () => {
    return formData.name && formData.name.trim().length >= 2 &&
           formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
           formData.department;
  };

  return (
    <div className="card-modern relative overflow-hidden group animate-slide-up">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/10 to-primary-600/5 rounded-full blur-3xl translate-y-32 -translate-x-32 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        {/* Header with gradient */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 
                        flex items-center justify-center shadow-xl transform group-hover:rotate-12 
                        transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
            {initialData ? (
              <FaUserEdit className="text-white text-2xl relative z-10" />
            ) : (
              <FaUserPlus className="text-white text-2xl relative z-10" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {initialData ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
              <span>{initialData ? 'Update employee information' : 'Fill in the details to add a new employee'}</span>
            </p>
          </div>
        </div>

        {/* Required Fields Notice */}
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
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className={formData.name ? 'text-green-600' : 'text-red-500'}>
                    Name {formData.name ? '✓' : '(required)'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${formData.email ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className={formData.email ? 'text-green-600' : 'text-red-500'}>
                    Email {formData.email ? '✓' : '(required)'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${formData.department ? 'bg-green-500' : 'bg-red-400'}`}></div>
                  <span className={formData.department ? 'text-green-600' : 'text-red-500'}>
                    Department {formData.department ? '✓' : '(required)'}
                  </span>
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
          {/* Name Input - Required */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.name && touched.name ? 'text-red-500' : isFocused.name || formData.name ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaUser className="text-xs" />
              <span>Full Name</span>
              <span className="text-red-500 text-lg leading-none">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, name: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, name: false});
                  handleBlur('name');
                }}
                required
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400
                         ${errors.name && touched.name 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : formData.name 
                             ? 'border-green-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300' 
                             : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="e.g., John Doe"
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in flex items-center space-x-1">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.name}</span>
                </p>
              )}
              {!errors.name && formData.name && (
                <p className="absolute -bottom-5 left-0 text-xs text-green-500 animate-fade-in flex items-center space-x-1">
                  <FaCheckCircle className="text-xs" />
                  <span>Name looks good!</span>
                </p>
              )}
            </div>
          </div>

          {/* Email Input - Required */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.email && touched.email ? 'text-red-500' : isFocused.email || formData.email ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaEnvelope className="text-xs" />
              <span>Email Address</span>
              <span className="text-red-500 text-lg leading-none">*</span>
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, email: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, email: false});
                  handleBlur('email');
                }}
                required
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400
                         ${errors.email && touched.email 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : formData.email && !errors.email
                             ? 'border-green-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300' 
                             : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="e.g., john.doe@company.com"
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in flex items-center space-x-1">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.email}</span>
                </p>
              )}
              {!errors.email && formData.email && (
                <p className="absolute -bottom-5 left-0 text-xs text-green-500 animate-fade-in flex items-center space-x-1">
                  <FaCheckCircle className="text-xs" />
                  <span>Valid email format</span>
                </p>
              )}
            </div>
          </div>

          {/* Phone Input - Optional */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.phone && touched.phone ? 'text-red-500' : isFocused.phone || formData.phone ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaPhone className="text-xs" />
              <span>Phone Number</span>
              <span className="text-gray-400 text-xs ml-1">(optional)</span>
            </label>
            <div className="relative group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, phone: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, phone: false});
                  handleBlur('phone');
                }}
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400
                         ${errors.phone && touched.phone 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="e.g., +1 (555) 000-0000"
                disabled={isSubmitting}
              />
              {errors.phone && touched.phone && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Department Select - Required */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.department && touched.department ? 'text-red-500' : isFocused.department || formData.department ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaBuilding className="text-xs" />
              <span>Department</span>
              <span className="text-red-500 text-lg leading-none">*</span>
            </label>
            <div className="relative group">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, department: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, department: false});
                  handleBlur('department');
                }}
                required
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 appearance-none cursor-pointer
                         ${errors.department && touched.department 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : formData.department
                             ? 'border-green-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300' 
                             : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                disabled={isSubmitting}
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className={`w-5 h-5 ${isFocused.department ? 'text-primary-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              {errors.department && touched.department && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in flex items-center space-x-1">
                  <FaExclamationCircle className="text-xs" />
                  <span>{errors.department}</span>
                </p>
              )}
            </div>
          </div>

          {/* Image URL Input - Optional */}
          <div className="relative">
            <label className={`absolute left-4 -top-2.5 px-2 bg-white text-sm font-medium 
                            transition-all duration-300 z-10 flex items-center space-x-1
                            ${errors.image && touched.image ? 'text-red-500' : isFocused.image || formData.image ? 'text-primary-600' : 'text-gray-500'}`}>
              <FaImage className="text-xs" />
              <span>Profile Image URL</span>
              <span className="text-gray-400 text-xs ml-1">(optional)</span>
            </label>
            <div className="relative group">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                onFocus={() => setIsFocused({...isFocused, image: true})}
                onBlur={() => {
                  setIsFocused({...isFocused, image: false});
                  handleBlur('image');
                }}
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-2xl
                         focus:outline-none focus:ring-4 transition-all duration-300 
                         text-gray-700 placeholder-gray-400
                         ${errors.image && touched.image 
                           ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
                           : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100 group-hover:border-primary-300'
                         }`}
                placeholder="https://example.com/profile.jpg"
                disabled={isSubmitting}
              />
              {errors.image && touched.image && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500 animate-fade-in">
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl animate-fade-in border border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={() => setImagePreview(null)}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Profile Image Preview</p>
                <p className="text-sm text-gray-700 truncate">{formData.image}</p>
              </div>
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
                         ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-xl' 
                         : 'bg-gradient-to-r from-gray-400 to-gray-500'
                       }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{initialData ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  {initialData ? (
                    <>
                      <FaSave className="group-hover:rotate-12 transition-transform duration-300" />
                      <span>Update Employee</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add Employee</span>
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

          {/* Form Footer with Required Fields Info */}
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
      </div>
    </div>
  );
};

export default EmployeeForm;