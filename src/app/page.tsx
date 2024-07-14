"use client";
import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "./fonts";
import Dropdown from "./_components/Dropdown";
import Translations from "./_components/Translations";

export type Translation = {
  translator: string;
  text: string;
};

export default function Home() {
  const [translationData, setTranslationData] = useState<Translation[]>([]);
  const [text, setText] = useState("");
  const [textChanged, setTextChanged] = useState(false);
  const [fromLang, setFromLang] = useState("EN");
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

  useEffect(() => {
    setTextChanged(true);
  }, [text, fromLang, toLang]);

  const apis = [
    { name: "DeepL", translator: "/api/DeepLTranslate" },
    { name: "Google", translator: "/api/GoogleTranslate" },
    { name: "Bing/Microsoft", translator: "/api/BingTranslate" },
    { name: "Reverso", translator: "/api/ReversoTranslate" },
  ];

  const translate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: add alert
    if (!textChanged || text.trim() == "") return;

    setTranslationData([]);

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
            translator: api.name,
            text: body.error,
          },
        ]);
        return;
      }

      const translationData: { translatedText: string } = await res.json();
      setTranslationData((prevTranslatedData) => [
        ...prevTranslatedData,
        { translator: api.name, text: translationData.translatedText },
      ]);
    });
    setTextChanged(false);
  };

  const checkEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key == "Enter" && !e.shiftKey) translate(e);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row gap-24 justify-center items-center">
      <div
        ref={divRef}
        className="relative w-[575px] h-[375px] min-h-[375px] bg-[#E7DECD] rounded-xl flex flex-col outline-none focus:ring-outline-1 focus:ring-outline-sky-500"
      >
        <Dropdown
          toLang={toLang}
          fromLang={fromLang}
          setFromLang={setFromLang}
          setToLang={setToLang}
        />
        <hr className="bg-black border-0 h-[1px]" />
        <form
          onSubmit={translate}
          onKeyDown={checkEnterPress}
          className="flex flex-col flex-1"
        >
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
