import { motion, Variants } from "framer-motion";

const LoadingAnimation = () => {
  const dotVariants: Variants = {
    initial: {
      y: 0,
    },
    animate: {
      y: 10,
      transition: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex gap-3 justify-center"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.2 }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-[#677DB7] w-2.5 h-2.5 rounded-3xl"
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
};

export default LoadingAnimation;
