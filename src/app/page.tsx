"use client";
import { useState } from "react";
import TranslationList from "@/components/TranslationList";
import TranslationForm from "@/components/TranslationForm";

export type TranslationData = {
  translator: string;
  text: string;
  succeeded: boolean;
};

const apis = [
  { translator: "DeepL", endpoint: "/api/DeepLTranslate" },
  { translator: "Google", endpoint: "/api/GoogleTranslate" },
  { translator: "Bing", endpoint: "/api/BingTranslate" },
  { translator: "Reverso", endpoint: "/api/ReversoTranslate" },
];

const Home = () => {
  const [translations, setTranslations] = useState<TranslationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const translate = async (fromLang: string, toLang: string, text: string) => {
    setIsLoading(true);
    setTranslations([]);

    await Promise.all(
      apis.map(async (api) => {
        const res = await fetch(api.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, fromLang, toLang }),
        });

        if (!res.ok) {
          const { error }: { error: string } = await res.json();
          console.error(error);
        } else {
          const { translatedText }: { translatedText: string } =
            await res.json();
          setTranslations((prevTranslatedData) => [
            ...prevTranslatedData,
            {
              translator: api.translator,
              text: translatedText,
              succeeded: true,
            },
          ]);
          setIsLoading(false);
        }
      }),
    );
    setIsLoading(false); // set loading state to false in the case that every translation api calls fail
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:justify-center items-center flex-1 py-8 md:px-8 w-full">
      <TranslationForm translate={translate} />
      <TranslationList translations={translations} isLoading={isLoading} />
    </div>
  );
};

export default Home;
