import { mplus, lato } from "../fonts";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  translator: string;
  text: string;
  fontSize: number;
  itemIndex: number;
};

export default function Translation({
  translator,
  text,
  fontSize,
  itemIndex,
}: Props) {
  const [show, setShow] = useState(false);

  const translationAnimation: Variants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    enter: {
      opacity: 1,
      scale: 1,
    },
  };

  const textContainerAnimation: Variants = {
    initial: {
      height: "0px",
    },
    enter: {
      height: text.length < 100 ? "125px" : "auto",
      transition: {
        duration: text.length < 100 ? 0.15 : 0.2,
        ease: "easeInOut",
      },
    },
    exit: {
      height: "0px",
      transition: { duration: text.length < 100 ? 0.15 : 0.2 },
    },
  };

  const textAnimation: Variants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: text.length < 100 ? 0.15 : 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      if (text.length < 100 || itemIndex === 0) setShow(true);
    }, 750);

    return () => clearTimeout(showTimeout);
  }, [text.length, itemIndex]);

  return (
    <motion.div
      layout
      variants={translationAnimation}
      initial="initial"
      animate="enter"
      transition={{ duration: 0.5 }}
      className="w-[400px] bg-[#E7DECD] rounded-lg"
    >
      <div className="flex justify-between">
        <motion.div
          className={`text-[14px] text-white bg-[#677DB7] rounded-tl-lg ${show ? "rounded-br-md" : "rounded-bl-md"} transition-all duration-1000 p-1.5 ${mplus.className} font-medium`}
        >
          {translator}
        </motion.div>
        <button
          className={`bg-[#677DB7] rounded-tr-lg ${show ? "rounded-bl-md" : "rounded-br-lg"} transition-all duration-1000 p-2 hover:bg-[#677DB7]/90`}
          onClick={() => setShow(!show)}
        >
          <motion.div animate={{ rotate: show ? 90 : 0 }}>
            <Image
              src="/down-chevron.svg"
              alt="down-chevron"
              width={16}
              height={16}
            />
          </motion.div>
        </button>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className={`text-[${fontSize}px] flex justify-center items-center ${lato.className}`}
            key={translator}
            variants={textContainerAnimation}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <motion.div
              className="py-2 px-3"
              variants={textAnimation}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {text}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
