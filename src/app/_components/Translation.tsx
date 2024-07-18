import { mplus, lato } from "../fonts";
import { AnimatePresence, motion, useAnimate, Variants } from "framer-motion";
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
  const [scope, animate] = useAnimate();

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
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      height: "0px",
      transition: { duration: 0.25 },
    },
  };

  const textAnimation: Variants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.1,
        delay: 0.2,
        ease: "easeInOut",
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

  const addPadding = () => {
    animate(
      scope.current,
      {
        paddingTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 8,
      },
      { duration: 0.1 },
    );
  };

  return (
    <motion.div
      layout
      variants={translationAnimation}
      initial="initial"
      animate="enter"
      transition={{ duration: 0.6 }}
      className="w-[400px] bg-[#E7DECD] rounded-xl flex flex-col"
    >
      <div className="flex justify-between">
        <motion.div
          animate={{ transition: { duration: 1 } }}
          className={`text-[14px] text-white bg-[#677DB7] rounded-tl-lg ${show ? "rounded-br-md" : "rounded-bl-md"} p-1.5 ${mplus.className} font-medium`}
        >
          {translator}
        </motion.div>
        <button
          className={`bg-[#677DB7] rounded-tr-lg ${show ? "rounded-bl-md" : "rounded-br-lg"} p-2 hover:bg-[#677DB7]/90`}
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
            onAnimationComplete={addPadding}
          >
            <motion.div
              ref={scope}
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
