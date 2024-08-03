import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "../fonts";
import useWindowDimensions from "../_hooks/useWindowDimensions";

type Props = {
  translate: (fromLang: string, toLang: string, text: string) => Promise<void>;
  toLang: string;
  fromLang: string;
};
const Form = ({ translate, fromLang, toLang }: Props) => {
  const [text, setText] = useState("");
  const { width } = useWindowDimensions();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const translationChanged = useRef(false);

  const checkEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) handleTranslation(e);
  };

  const handleTranslation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (translationChanged.current && text.trim() !== "") {
      translate(fromLang, toLang, text.trim());
      translationChanged.current = false;
    }
  };

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    translationChanged.current = true;
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea === null) return;

    // handling the font size
    if (text.length > 150 || width < 640) {
      textArea.style.fontSize = 18 + "px";
    } else if (text.length > 50) {
      textArea.style.fontSize = 20 + "px";
    } else {
      textArea.style.fontSize = 24 + "px";
    }

    // dynamically resize the text area as content increases
    textArea.style.height = "auto"; // resets the "height" of text area allowing it to shrink when removing content
    textArea.style.height = `${textArea.scrollHeight}px`; // set height to height of the content within text area (that is the scrollHeight)
  }, [text, width]);

  useEffect(() => {
    translationChanged.current = true;
  }, [fromLang, toLang]);

  return (
    <form
      onSubmit={handleTranslation}
      onKeyDown={checkEnterPress}
      className="flex flex-col w-full"
    >
      <textarea
        maxLength={3000}
        ref={textAreaRef}
        placeholder="hit enter or press translate to query. `Shift + Enter` for new line"
        value={text}
        onChange={handleText}
        className={`min-h-[250px] md:min-h-[275] lg:min-h-[350px] outline-none resize-none text-black p-5 pt-2 placeholder-slate-500 bg-inherit ${lato.className} text-xl placeholder:text-xl lg:placeholder:text-2xl`} // min height used as we are dynamically resizing the text area based on content
      />
      <button
        type="submit"
        className={`w-fit self-end text-white font-bold bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
      >
        Translate
      </button>
    </form>
  );
};

export default Form;
