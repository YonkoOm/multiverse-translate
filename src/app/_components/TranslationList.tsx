import { Translation } from "../page";
import { mplus, lato } from "../fonts";
import { motion, Variants } from "framer-motion";

type Props = {
  translations: Translation[];
  fontSize: number;
};

// TODO: fix translations' entrances
export default function TranslationList({ translations, fontSize }: Props) {
  const enterAnimation: Variants = {
    initial: {
      scale: 0,
    },
    enter: {
      scale: 1,
    },
  };

  return (
    <div className="text-black gap-3 flex flex-col">
      {translations.map((translation) => (
        <motion.div
          variants={enterAnimation}
          initial="initial"
          animate="enter"
          transition={{ duration: 0.6 }}
          key={translation.translator}
          className="relative"
        >
          <div
            className={`absolute text-[14px] text-white top-0 left-0 bg-[#677DB7] rounded-tl-lg rounded-br-lg p-1.5 ${mplus.className} font-medium`}
          >
            {translation.translator}
          </div>
          <div
            className={`rounded-xl p-6 pt-10 w-[400px] min-h-[150px] bg-[#E7DECD]  flex items-center justify-center ${lato.className}`}
            style={{ fontSize }}
          >
            {translation.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
