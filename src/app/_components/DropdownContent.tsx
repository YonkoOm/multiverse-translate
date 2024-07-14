import { languages } from "../_utils/languages";
import { lato } from "../fonts";
import { motion, Variants } from "framer-motion";

type Props = {
  activeLang: string;
  setLanguage: (lang: string) => void;
};

export default function DropdownContent({ activeLang, setLanguage }: Props) {
  const openAnimation: Variants = {
    initial: {
      opacity: 0,
      height: 0,
    },
    enter: {
      opacity: 1,
      height: "100%",
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      height: "50%",
      transition: { duration: 0.3 },
    },
  };
  return (
    <motion.div
      variants={openAnimation}
      initial="initial"
      exit="exit"
      animate="enter"
      className="absolute w-full h-full bg-[#E7DECD] rounded-bl-xl rounded-br-xl z-10 overflow-hidden"
    >
      <div
        className={`grid grid-cols-3 gap-y-1 gap-x-1 ${lato.className} text-base p-2 overflow-y-auto h-full`}
      >
        {Object.keys(languages).map((lang) => (
          <div
            className={`w-44 cursor-pointer hover:bg-[#8F99FB]/50 rounded-md p-0.5 pl-2 pr-5 ${lang == activeLang ? "bg-[#8F99FB]/50" : undefined}`}
            key={lang}
            onClick={() => setLanguage(lang)}
          >
            {languages[lang]}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
