import { motion, Variants } from "framer-motion";
import { languages } from "../_utils/languages";
import { lato } from "../fonts";
import { useEffect, useRef } from "react";

type Props = {
  activeLang: string;
  setLanguage: (lang: string) => void;
  handleOutsideClick: (
    e: MouseEvent,
    ref: React.RefObject<HTMLDivElement>,
  ) => void;
};

const DropdownContent = ({
  activeLang,
  setLanguage,
  handleOutsideClick,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const dropdownAnimation: Variants = {
    initial: {
      opacity: 0,
      height: 0,
    },
    enter: {
      opacity: 1,
      height: "100%",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleOutsideClick(e, contentRef);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleOutsideClick]);

  return (
    <motion.div
      ref={contentRef}
      variants={dropdownAnimation}
      initial="initial"
      exit="exit"
      animate="enter"
      className="absolute w-full max-h-[350px] shadow-xl bg-[#E7DECD] rounded-bl-xl rounded-br-xl z-10 overflow-hidden"
    >
      <motion.div
        className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-1 gap-x-1 ${lato.className} text-base p-2 overflow-y-scroll h-full`}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        {Object.keys(languages).map((lang) => (
          <div
            className={`w-1/2 sm:w-24 md:w-40 lg:w-28 xl:w-40 cursor-pointer hover:bg-[#8F99FB]/50 rounded-md p-0.5 pl-2 pr-5 ${lang == activeLang ? "bg-[#8F99FB]/50" : undefined}`}
            key={lang}
            onClick={() => setLanguage(lang)}
          >
            {languages[lang]}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DropdownContent;
