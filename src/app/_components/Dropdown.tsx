import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { languages } from "../_utils/languages";
import { mplus } from "../fonts";
import DropdownContent from "./DropdownContent";
import Image from "next/image";

type Props = {
  fromLang: string;
  toLang: string;
  setFromLang: React.Dispatch<React.SetStateAction<string>>;
  setToLang: React.Dispatch<React.SetStateAction<string>>;
};

const Dropdown = ({ fromLang, toLang, setFromLang, setToLang }: Props) => {
  const [fromLangDropIsOpen, setFromLangDropIsOpen] = useState(false);
  const [toLangDropIsOpen, setToLangDropIsOpen] = useState(false);

  const switchLang = () => {
    if (toLang != fromLang) {
      localStorage.setItem("fromLang", toLang);
      localStorage.setItem("toLang", fromLang);
      const fromLangTemp = fromLang;
      setFromLang(toLang);
      setToLang(fromLangTemp);
    }
  };

  const setLanguage = (lang: string) => {
    if (fromLangDropIsOpen) {
      setFromLang(lang);
      setFromLangDropIsOpen(false);
      localStorage.setItem("fromLang", lang);
    }
    if (toLangDropIsOpen) {
      setToLang(lang);
      setToLangDropIsOpen(false);
      localStorage.setItem("toLang", lang);
    }
  };

  const handleOutsideClick = (
    event: MouseEvent,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    if (!ref.current) return;

    if (!ref.current.contains(event.target as Node)) {
      if (fromLangDropIsOpen) setFromLangDropIsOpen(false);
      if (toLangDropIsOpen) setToLangDropIsOpen(false);
    }
  };

  const buttonVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div>
      <div
        className={`flex w-full justify-between sm:items-center ${mplus.className} text-sm md:text-base`}
      >
        <motion.button
          className="text-white flex flex-1 sm:flex-initial gap-x-2 bg-[#677DB7] hover:bg-[#677DB7]/90 px-3 sm:py-3 rounded-tl-xl font-bold items-center justify-center"
          onClick={() => {
            if (toLangDropIsOpen) setToLangDropIsOpen(false);
            setFromLangDropIsOpen(!fromLangDropIsOpen);
          }}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
        >
          <div>{languages[fromLang]}</div>
          <motion.div
            className="shrink-0"
            animate={{ rotate: fromLangDropIsOpen ? 180 : 0 }}
          >
            <Image
              src="/down-chevron.svg"
              alt="down chevron"
              width={14}
              height={14}
            />
          </motion.div>
        </motion.button>
        <button
          className="mx-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 hover:bg-[#677DB7]/20 rounded-lg shrink-0"
          onClick={switchLang}
        >
          <Image
            src="/switch.png"
            alt="switch languages"
            sizes="40px"
            width={40}
            height={40}
            priority
          />
        </button>
        <motion.button
          className="text-white flex flex-1 sm:flex-initial gap-x-2 bg-[#677DB7] hover:bg-[#677DB7]/90 px-3 sm:py-3 rounded-tr-xl font-bold items-center justify-center"
          onClick={() => {
            if (fromLangDropIsOpen) setFromLangDropIsOpen(false);
            setToLangDropIsOpen(!toLangDropIsOpen);
          }}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
        >
          <div>{languages[toLang]}</div>
          <motion.div
            className="shrink-0"
            animate={{ rotate: toLangDropIsOpen ? 180 : 0 }}
          >
            <Image
              src="/down-chevron.svg"
              alt="down chevron"
              width={14}
              height={14}
            />
          </motion.div>
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        {fromLangDropIsOpen && (
          <DropdownContent
            key="from"
            activeLang={fromLang}
            setLanguage={setLanguage}
            handleOutsideClick={handleOutsideClick}
          />
        )}
        {toLangDropIsOpen && (
          <DropdownContent
            key="to"
            activeLang={toLang}
            setLanguage={setLanguage}
            handleOutsideClick={handleOutsideClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
