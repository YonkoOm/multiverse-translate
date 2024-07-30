"use client";
import { useState } from "react";
import TranslationList from "./_components/TranslationList";
import TranslationForm from "./_components/TranslationForm";

export type Translation = {
  translator: string;
  text: string;
  succeeded: boolean;
};

const Home = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [listFontSize, setListFontSize] = useState(26);
  const [formFontSize, setFormFontSize] = useState(26);
  const [isLoading, setIsLoading] = useState(false);

  const apis = [
    { name: "DeepL", translator: "/api/DeepLTranslate" },
    { name: "Google", translator: "/api/GoogleTranslate" },
    { name: "Bing", translator: "/api/BingTranslate" },
    { name: "Reverso", translator: "/api/ReversoTranslate" },
  ];

  const translate = async (fromLang: string, toLang: string, text: string) => {
    setIsLoading(true);
    setListFontSize(formFontSize);
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
      } else {
        const { translatedText }: { translatedText: string } = await res.json();
        setTranslations((prevTranslatedData) => [
          ...prevTranslatedData,
          { translator: api.name, text: translatedText, succeeded: true },
        ]);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:justify-center items-center flex-1 py-8 md:px-8 w-full">
      <TranslationForm
        translate={translate}
        setFormFontSize={setFormFontSize}
      />
      <TranslationList
        translations={translations}
        fontSize={listFontSize}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
