import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { languages } from "../_utils/languages";
import { mplus } from "../fonts";
import DropdownContent from "./DropdownContent";

type Props = {
  fromLang: string;
  toLang: string;
  setFromLang: React.Dispatch<React.SetStateAction<string>>;
  setToLang: React.Dispatch<React.SetStateAction<string>>;
};

const Dropdown = ({ fromLang, toLang, setFromLang, setToLang }: Props) => {
  const [fromLangDropIsOpen, setFromLangDropIsOpen] = useState(false);
  const [toLangDropIsOpen, setToLangDropIsOpen] = useState(false);
  const [count, setCount] = useState(0); // used as a solution to fix key issue with AnimatePresence when quickly exiting and entering the component

  const switchLang = () => {
    if (toLang != fromLang) {
      setFromLang(toLang);
      setToLang(fromLang);
    }
  };

  const setLanguage = (lang: string) => {
    if (fromLangDropIsOpen) {
      setFromLang(lang);
      setFromLangDropIsOpen(false);
    }
    if (toLangDropIsOpen) {
      setToLang(lang);
      setToLangDropIsOpen(false);
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

  return (
    <div>
      <div
        className={`relative items-stretch flex flex-row w-full justify-between lg:items-center ${mplus.className} text-sm md:text-base`}
      >
        <button
          className="text-white flex flex-1 lg:flex-initial gap-x-2 bg-[#677DB7] hover:bg-[#677DB7]/90 px-3 lg:py-3 rounded-tl-xl font-bold items-center justify-center"
          onClick={() => {
            if (toLangDropIsOpen) setToLangDropIsOpen(false);
            setFromLangDropIsOpen(!fromLangDropIsOpen);
            setCount(count + 1);
          }}
        >
          <div className="max-[480px]:flex-1">{languages[fromLang]}</div>
          <motion.div
            className="w-[14px] h-[14px] relative flex-none"
            animate={{ rotate: fromLangDropIsOpen ? 180 : 0 }}
          >
            <Image src="/down-chevron.svg" alt="down-chevron" fill />
          </motion.div>
        </button>
        <button
          className="mx-auto lg:absolute lg:left-1/2 lg:-translate-x-1/2 hover:bg-[#677DB7]/20 rounded-lg"
          onClick={switchLang}
        >
          <div className="w-10 h-10 relative">
            <Image src="/switch.png" alt="switch" fill sizes="100px" priority />
          </div>
        </button>
        <button
          className="text-white flex flex-1 lg:flex-initial gap-x-2 bg-[#677DB7] hover:bg-[#677DB7]/90 px-3 lg:p-3 rounded-tr-xl font-bold items-center justify-center"
          onClick={() => {
            if (fromLangDropIsOpen) setFromLangDropIsOpen(false);
            setToLangDropIsOpen(!toLangDropIsOpen);
            setCount(count + 1);
          }}
        >
          <div className="max-[480px]:flex-1">{languages[toLang]}</div>
          <motion.div
            className="w-[14px] h-[14px] relative flex-none"
            animate={{ rotate: toLangDropIsOpen ? 180 : 0 }}
          >
            <Image src="/down-chevron.svg" alt="down-chevron" fill />
          </motion.div>
        </button>
      </div>
      <AnimatePresence mode="wait">
        {fromLangDropIsOpen !== toLangDropIsOpen && (
          <DropdownContent
            key={count}
            activeLang={fromLangDropIsOpen ? fromLang : toLang}
            setLanguage={setLanguage}
            handleOutsideClick={handleOutsideClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
