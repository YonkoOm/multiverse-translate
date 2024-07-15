"use client";
import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "./fonts";
import Dropdown from "./_components/Dropdown";
import TranslationList from "./_components/TranslationList";

export type Translation = {
  translator: string;
  text: string;
};

export default function Home() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [text, setText] = useState("");
  const [fromLang, setFromLang] = useState("EN");
  const [toLang, setToLang] = useState("EN");
  const [fontSize, setFontSize] = useState(18);
  const divRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const translationChanged = useRef(false);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea != null) {
      if (text.length > 400) {
        setFontSize(18);
      } else if (text.length > 300) {
        setFontSize(20);
      } else if (text.length > 200) {
        setFontSize(24);
      } else {
        setFontSize(28);
      }

      const div = divRef.current;
      if (div !== null) {
        div.style.height = "auto"; // resets the "height" of texarea allowing it to shrink when removing content
        div.style.height = `${textArea.scrollHeight + 100}px`; // set height to height of the content within textarea (that is the scrollHeight)
      }
    }
  }, [text]);

  useEffect(() => {
    translationChanged.current = true;
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
    if (!translationChanged.current || text.trim() == "") return;

    setTranslations([]);

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
    translationChanged.current = false;
  };

  const checkEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key == "Enter" && !e.shiftKey) translate(e);
  };

  // TODO: maybe move translation container so it doesn't it doesn't need to move when translations appear
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row gap-24 justify-center items-center">
      <div
        ref={divRef}
        className="relative w-[575px] h-[375px] min-h-[375px] bg-[#E7DECD] rounded-xl flex flex-col focus-within:shadow-[0px_0px_0px_1.5px_#8F99FB]"
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
            placeholder="hit enter or press translate to query. `Shift + Enter` for new line"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`outline-none resize-none text-black w-full h-full p-5 pt-2 placeholder-slate-500 bg-inherit overflow-hidden ${lato.className} placeholder:text-2xl`}
            style={{ fontSize }}
          />
          <button
            type="submit"
            className={`text-white font-bold w-fit self-end bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
          >
            Translate
          </button>
        </form>
      </div>
      <TranslationList translations={translations} fontSize={fontSize} />
    </div>
  );
}
