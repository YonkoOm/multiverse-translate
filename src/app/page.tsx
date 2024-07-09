"use client";
import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "./fonts";

type Translator = {
  name: string;
  translation: string;
};

export default function Home() {
  const [translationData, setTranslationData] = useState<Translator[]>([]);
  const [text, setText] = useState("");
  const [fromLanguage, setFromLanguge] = useState("EN");
  const [toLanguage, setToLanguage] = useState("EN");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const form = formRef.current;
    if (form !== null && textArea !== null) {
      form.style.height = "auto"; // resets the "height" of texarea allowing it to shrink when removing content
      form.style.height = `${textArea.scrollHeight - 75}px`; // set height to height of the content within textarea (that is the scrollHeight)
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
        body: JSON.stringify({
          text: text,
          fromLang: "EN",
          toLang: "KO",
        }),
      });

      if (!res.ok) {
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
      <form
        ref={formRef}
        onSubmit={translate}
        className="relative w-[500px] h-[300px] min-h-[300px]" // min-h overrides height's value when height < 300px
      >
        <textarea
          ref={textAreaRef}
          placeholder="Enter text here to translate :)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`outline-none focus:outline-1 focus:outline-sky-500 resize-none text-black p-5 pb-32 w-full h-full text-[28px] placeholder-slate-500 bg-[#E7DECD] rounded-xl overflow-hidden ${lato.className}`}
        />
        <button
          type="submit"
          className={`text-white font-bold absolute bottom-0 right-0 bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
        >
          Translate
        </button>
      </form>
      <div className="text-black gap-3 flex flex-col">
        {translationData.map((text, i) => (
          <div key={text.name + i} className="relative">
            <div
              className={`absolute text-[14px] text-white top-0 left-0 bg-[#677DB7] rounded-tl-lg rounded-br-lg p-1.5 ${mplus.className} font-medium`}
            >
              {text.name}
            </div>
            <div
              className={`rounded-xl p-6 pt-10 w-[400px] min-h-[150px] bg-[#E7DECD] text-2xl flex items-center justify-center ${lato.className}`}
            >
              {text.translation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
