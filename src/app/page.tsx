"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "./_components/Dropdown";
import TranslationList from "./_components/TranslationList";
import TranslationForm from "./_components/TranslationForm";

export type Translation = {
  translator: string;
  text: string;
  succeeded: boolean;
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

  const translate = async (textToTranslate: string) => {
    const text = textToTranslate.trim();

    if (!translationChanged.current || text === "") return;
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

      if (res.status === 400) {
        const body = await res.json();
        console.error(body.error);
        translationChanged.current = true;
        return;
      } else if (!res.ok) {
        const body = await res.json();
        setTranslations((prevTranslation) => [
          ...prevTranslation,
          {
            translator: api.name,
            text: body.error,
            succeeded: false,
          },
        ]);
        translationChanged.current = true;
        return;
      }

      const { translatedText }: { translatedText: string } = await res.json();
      setTranslations((prevTranslatedData) => [
        ...prevTranslatedData,
        { translator: api.name, text: translatedText, succeeded: true },
      ]);
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row gap-12 justify-center items-center py-10 md:p-24">
      <motion.div
        layout
        ref={inputContainerRef}
        className="relative w-4/5 sm:w-[450px] md:w-[575px] h-[400px] min-h-[400px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]"
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
