import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="bg-gradient-primary p-4 rounded-2xl mb-4">
        <Icon className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
