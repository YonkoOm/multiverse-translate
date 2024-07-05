"use client";
import { useEffect, useRef, useState } from "react";

interface Translator {
  name: string;
  translation: string;
}

export default function Home() {
  const [translatedTexts, setTranslatedTexts] = useState<Translator[]>([]);
  const [text, setText] = useState("");
  const [fromLanguage, setFromLanguge] = useState("EN");
  const [toLanguage, setToLanguage] = useState("EN");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef && textAreaRef) {
      const textArea = textAreaRef.current;
      const form = formRef.current;
      if (form && textArea) {
        form.style.height = "auto";
        form.style.height = `${textArea.scrollHeight - 75}px`;
      }
    }
  }, [text]);

  const apis = [
    { name: "DeepL", translator: "/api/DeepLTranslate" },
    { name: "Google", translator: "/api/GoogleTranslate" },
    { name: "Bing/Microsoft", translator: "/api/BingTranslate" },
    { name: "Reverso", translator: "/api/ReversoTranslate" },
  ];

  const translate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTranslatedTexts([]);

    apis.map(async (api) => {
      const response = await fetch(api.translator, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          fromLang: "EN",
          toLang: "KO",
        }),
      });

      const translationData = await response.json();
      setTranslatedTexts((prevTranslatedTexts) => [
        ...prevTranslatedTexts,
        { name: api.name, translation: translationData.translatedText },
      ]);
    });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center -translate-x-20">
      <form
        ref={formRef}
        onSubmit={translate}
        className="relative w-[500px] min-h-[300px]"
      >
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none text-black p-5 pb-32 w-full h-full text-3xl bg-[#E7DECD] rounded-xl overflow-hidden"
        />
        <button
          type="submit"
          className="text-white font-bold absolute bottom-0 right-0 bg-[#677DB7] p-2 rounded-tl-lg rounded-br-lg"
        >
          Translate
        </button>
      </form>
      <div className="text-black ml-24 space-y-[10px]">
        {translatedTexts.map((text, i) => (
          <div key={text.name + i} className="relative">
            <div className="absolute font-bold text-[14px] text-white top-0 left-0 bg-[#677DB7] rounded-tl-lg rounded-br-lg p-1.5">
              {text.name}
            </div>
            <div className="rounded-xl p-6 pt-10 w-[400px] min-h-[150px] bg-[#E7DECD] h-fit text-2xl flex items-center justify-center ">
              {text.translation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
