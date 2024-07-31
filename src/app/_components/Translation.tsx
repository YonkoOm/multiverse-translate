import { useEffect, useState } from "react";
import { mplus, lato } from "../fonts";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Translation as TranslationType } from "../page";
import Image from "next/image";
import useWindowDimensions from "../hooks/useWindowDimensions";

type Props = {
  translation: TranslationType;
  translationIndex: number;
};

const Translation = ({ translation, translationIndex }: Props) => {
  const [show, setShow] = useState(false);
  const { width } = useWindowDimensions();

  const { translator, text, succeeded } = translation;

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
      height: text.length < 75 && width > 480 ? "120px" : "auto",
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
      transition: { duration: 0.05 },
    },
  };

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      if (text.length < 150 || translationIndex === 0) setShow(true);
    }, 750);

    return () => {
      clearTimeout(showTimeout);
    };
  }, [text.length, translationIndex]);

  return (
    <motion.div
      layout
      variants={translationAnimation}
      initial="initial"
      animate="enter"
      transition={{ duration: 0.5 }}
      className="bg-[#E7DECD] rounded-lg flex flex-col"
    >
      <div className="flex justify-between">
        <motion.div
          animate={{
            borderBottomLeftRadius: !show ? 8 : 0,
            transition: { duration: 1, delay: 0.1 },
          }}
          className={`text-[14px] text-white bg-[#677DB7] rounded-tl-lg p-1.5 ${mplus.className} font-medium`}
        >
          {translator}
        </motion.div>
        <motion.button
          animate={{
            borderBottomRightRadius: !show ? 8 : 0,
            transition: { duration: 1, delay: 0.1 },
          }}
          className={`bg-[#677DB7] rounded-tr-lg p-2 hover:bg-[#677DB7]/90`}
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
        </motion.button>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className={`${!succeeded && "text-xl"} ${lato.className}`}
            key={translator}
            variants={textContainerAnimation}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <motion.div
              className="py-2 px-3 border-t-[#C5BDAF] border-t-[1px] w-full h-full flex justify-center items-center"
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
};

export default Translation;
