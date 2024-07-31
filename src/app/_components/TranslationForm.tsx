import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "./Dropdown";
import Form from "./Form";

type Props = {
  translate: (fromLang: string, toLang: string, text: string) => Promise<void>;
};

const TranslationForm = ({ translate }: Props) => {
  const [fromLang, setFromLang] = useState(() => {
    if (typeof window === undefined) return "EN";
    const fromLang = localStorage.getItem("fromLang");
    return fromLang ? fromLang : "EN";
  });
  const [toLang, setToLang] = useState(() => {
    if (typeof window === undefined) return "EN";
    const toLang = localStorage.getItem("toLang");
    return toLang ? toLang : "EN";
  });

  return (
    <motion.div className="relative w-4/5 md:w-9/12 lg:w-[575px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]">
      <Dropdown
        toLang={toLang}
        fromLang={fromLang}
        setFromLang={setFromLang}
        setToLang={setToLang}
      />
      <hr className="bg-black border-0 h-[1px]" />
      <Form translate={translate} toLang={toLang} fromLang={fromLang} />
    </motion.div>
  );
};

export default TranslationForm;
