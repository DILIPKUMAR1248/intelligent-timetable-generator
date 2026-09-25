import { motion } from 'framer-motion';

const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 rounded',
    circle: 'w-10 h-10 rounded-full',
    card: 'h-24 rounded-xl',
    text: 'h-6 rounded',
    avatar: 'w-12 h-12 rounded-full',
  };

  return (
    <motion.div
      animate={{
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-gray-200 dark:bg-gray-700 ${variants[variant]} ${className}`}
    />
  );
};

export default LoadingSkeleton;
