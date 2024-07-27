import { motion, Variants } from "framer-motion";

const LoadingAnimation = () => {
  const containerVariants = {
    initial: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants: Variants = {
    initial: {
      y: 0,
    },
    animate: {
      y: 15,
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
      className="flex gap-3 justify-center sm:w-[425px] md:w-[450px]"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="bg-[#677DB7] w-2.5 h-2.5 rounded-3xl block"
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
};

export default LoadingAnimation;
