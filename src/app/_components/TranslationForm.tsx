import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "./Dropdown";
import Form from "./Form";

type Props = {
  translate: (fromLang: string, toLang: string, text: string) => Promise<void>;
  setFormFontSize: React.Dispatch<React.SetStateAction<number>>;
};

const TranslationForm = ({ translate, setFormFontSize }: Props) => {
  const [fromLang, setFromLang] = useState("EN");
  const [toLang, setToLang] = useState("EN");

  return (
    <motion.div className="relative w-4/5 md:w-9/12 lg:w-[575px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]">
      <Dropdown
        toLang={toLang}
        fromLang={fromLang}
        setFromLang={setFromLang}
        setToLang={setToLang}
      />
      <hr className="bg-black border-0 h-[1px]" />
      <Form
        translate={translate}
        setFormFontSize={setFormFontSize}
        toLang={toLang}
        fromLang={fromLang}
      />
    </motion.div>
  );
};

export default TranslationForm;
