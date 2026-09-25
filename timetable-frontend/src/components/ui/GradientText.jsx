import { motion } from 'framer-motion';

const GradientText = ({
  children,
  className = '',
  size = 'text-4xl',
}) => {
  return (
    <motion.span
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-gradient-primary bg-clip-text text-transparent bg-[length:200%_200%] font-bold ${size} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
