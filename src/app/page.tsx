"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "./_components/Dropdown";
import TranslationList from "./_components/TranslationList";
import TranslationForm from "./_components/TranslationForm";

export type Translation = {
  translator: string;
  text: string;
};

const Home = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [fromLang, setFromLang] = useState("EN");
  const [toLang, setToLang] = useState("EN");
  const [listFontSize, setListFontSize] = useState(26);
  const [formFontSize, setFormFontSize] = useState(26);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const translationChanged = useRef(false);

  const apis = [
    { name: "DeepL", translator: "/api/DeepLTranslate" },
    { name: "Google", translator: "/api/GoogleTranslate" },
    { name: "Bing/Microsoft", translator: "/api/BingTranslate" },
    { name: "Reverso", translator: "/api/ReversoTranslate" },
  ];

  useEffect(() => {
    translationChanged.current = true;
  }, [fromLang, toLang]);

  const translate = async (text: string) => {
    // TODO: add alert
    if (!translationChanged.current || text.trim() == "") return;
    setListFontSize(formFontSize);

    setTranslations([]);
    translationChanged.current = false;

    apis.forEach(async (api) => {
      const res = await fetch(api.translator, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, fromLang, toLang }),
      });

      if (res.status == 400) {
        return;
      } else if (!res.ok) {
        const body = await res.json();
        setTranslations((prevTranslation) => [
          ...prevTranslation,
          {
            translator: api.name,
            text: body.error,
          },
        ]);
        return;
      }

      const { translatedText }: { translatedText: string } = await res.json();
      setTranslations((prevTranslatedData) => [
        ...prevTranslatedData,
        { translator: api.name, text: translatedText },
      ]);
    });
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row gap-24 justify-center items-center">
      <motion.div
        layout
        ref={inputContainerRef}
        className="relative w-[575px] h-[400px] min-h-[400px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]"
      >
        <Dropdown
          toLang={toLang}
          fromLang={fromLang}
          setFromLang={setFromLang}
          setToLang={setToLang}
        />
        <hr className="bg-black border-0 h-[1px]" />
        <TranslationForm
          translate={translate}
          inputContainerRef={inputContainerRef}
          translationChanged={translationChanged}
          setFormFontSize={setFormFontSize}
        />
      </motion.div>
      <TranslationList translations={translations} fontSize={listFontSize} />
    </div>
  );
};

export default Home;
