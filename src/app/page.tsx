"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { mplus } from "./fonts";
import Dropdown from "./_components/Dropdown";
import TranslationList from "./_components/TranslationList";
import TranslationForm from "./_components/TranslationForm";
import LoadingAnimation from "./_components/LoadingAnimation";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const translationChanged = useRef(false);

  const apis = [
    { name: "DeepL", translator: "/api/DeepLTranslate" },
    { name: "Google", translator: "/api/GoogleTranslate" },
    { name: "Bing", translator: "/api/BingTranslate" },
    { name: "Reverso", translator: "/api/ReversoTranslate" },
  ];

  useEffect(() => {
    translationChanged.current = true;
  }, [fromLang, toLang]);

  const translate = async (textToTranslate: string) => {
    const text = textToTranslate.trim();

    if (!translationChanged.current || text === "") return;
    setIsLoading(true);
    setListFontSize(formFontSize);
    translationChanged.current = false;

    setTranslations([]);

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
      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="p-2 w-fit border-b border-r bg-[#2A3E5F]/70 rounded-br-lg rounded-tr-md border-[#E7DECD] flex items-center gap-x-2">
        <div className="relative w-7 h-7 md:w-9 md:h-9">
          <Image src="/icon.png" fill sizes="48px" alt="translation-logo" />
        </div>
        <div
          className={`text-[#fff7ed] text-center text-xs md:text-sm font-bold ${mplus.className}`}
        >
          Multiverse Translate
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:justify-center items-center flex-1 py-10 md:p-8 w-full">
        <motion.div
          ref={inputContainerRef}
          className="relative w-4/5 md:w-8/12 lg:w-[575px] h-[400px] min-h-[350px] sm:min-h-[400px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]"
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
        {!isLoading ? (
          <TranslationList
            translations={translations}
            fontSize={listFontSize}
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>
    </div>
  );
};

export default Home;
