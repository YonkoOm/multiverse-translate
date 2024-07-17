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
  const [show, setShow] = useState(true);

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
      height: 0,
    },
    enter: {
      height: text.length < 100 ? "125px" : "auto",
      padding: 8,
      paddingLeft: 12,
      paddingRight: 12,
      transition: { duration: 0.3 },
    },
    exit: {
      padding: 0,
      minHeight: 0,
      height: 0,
      transition: { duration: 0.25 },
    },
  };

  const textAnimation: Variants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: { duration: 0.1, delay: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  useEffect(() => {
    if (text.length > 100 && itemIndex != 0) {
      setShow(false);
    }
  }, [text.length, itemIndex]);

  return (
    <motion.div
      variants={translationAnimation}
      initial="initial"
      animate="enter"
      transition={{ duration: 0.6 }}
      className="w-[400px] bg-[#E7DECD] rounded-xl flex flex-col"
    >
      <div className="flex relative">
        <motion.div
          className={`text-[14px] text-white bg-[#677DB7] rounded-tl-lg ${show ? "rounded-br-md" : undefined} p-1.5 ${mplus.className} font-medium`}
        >
          {translator}
        </motion.div>
        <button
          className={`bg-[#677DB7] ${show ? "rounded-bl-md " : "rounded-br-lg"} rounded-tr-lg p-2 hover:bg-[#677DB7]/90 ml-auto`}
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
