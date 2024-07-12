"use client";
import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "./fonts";
import Dropdown from "./_components/Dropdown";
import Translations from "./_components/Translations";

export type Translator = {
  name: string;
  translation: string;
};

export default function Home() {
  const [translationData, setTranslationData] = useState<Translator[]>([]);
  const [text, setText] = useState("");
  const [fromLang, setFromLang] = useState("EN"); // TODO: language selection implementation
  const [toLang, setToLang] = useState("EN");
  const divRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const div = divRef.current;
    if (div !== null && textArea !== null) {
      div.style.height = "auto"; // resets the "height" of texarea allowing it to shrink when removing content
      div.style.height = `${textArea.scrollHeight + 100}px`; // set height to height of the content within textarea (that is the scrollHeight)
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
    setTranslationData([]);

    // TODO: add alert
    if (text.trim() === "") {
      return;
    }

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
        setTranslationData((prevTranslatedData) => [
          ...prevTranslatedData,
          {
            name: api.name,
            translation: body.error,
          },
        ]);
        return;
      }

      const translationData: { translatedText: string } = await res.json();
      setTranslationData((prevTranslatedData) => [
        ...prevTranslatedData,
        { name: api.name, translation: translationData.translatedText },
      ]);
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-row gap-24 justify-center items-center">
      <div
        ref={divRef}
        className="relative w-[550px] min-h-[375px] bg-[#E7DECD] rounded-xl flex flex-col outline-none focus-within:outline-1 focus-within:outline-sky-500"
      >
        <Dropdown
          toLang={toLang}
          fromLang={fromLang}
          setFromLang={setFromLang}
          setToLang={setToLang}
        />
        <hr className="bg-black border-0 h-[1px]" />
        <form onSubmit={translate} className="flex flex-col flex-1">
          <textarea
            ref={textAreaRef}
            placeholder="Enter text here to translate :)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`outline-none resize-none text-black w-full h-full text-[28px] p-5 pt-2 placeholder-slate-500 bg-inherit overflow-hidden ${lato.className}`}
          />
          <button
            type="submit"
            className={`text-white font-bold w-fit self-end bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
          >
            Translate
          </button>
        </form>
      </div>
      <Translations translations={translationData} />
    </div>
  );
}
