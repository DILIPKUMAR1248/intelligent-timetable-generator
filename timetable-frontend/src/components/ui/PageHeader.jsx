import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumb,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {breadcrumb && (
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <span className={item.active ? 'text-indigo-600 font-medium' : ''}>
                {item.label}
              </span>
            </span>
          ))}
        </nav>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="bg-gradient-primary p-3 rounded-xl">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
