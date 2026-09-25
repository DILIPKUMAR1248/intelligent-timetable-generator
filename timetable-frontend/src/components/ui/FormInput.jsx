import { motion } from 'framer-motion';
import { useState } from 'react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  select = false,
  children,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const InputComponent = select ? 'select' : 'input';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {select ? (
          <motion.select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            animate={{
              borderColor: focused ? '#6366f1' : error ? '#ef4444' : '#e5e7eb',
              boxShadow: focused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
            }}
            className={`w-full px-4 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-200 ${Icon ? 'pl-10' : ''} cursor-pointer`}
            {...props}
          >
            {children}
          </motion.select>
        ) : (
          <motion.input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            animate={{
              borderColor: focused ? '#6366f1' : error ? '#ef4444' : '#e5e7eb',
              boxShadow: focused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
            }}
            className={`w-full px-4 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-all duration-200 ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-rose-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormInput;
