import { useState, useRef, useEffect } from "react";
import { mplus, lato } from "../fonts";

type Props = {
  translate: (textToTranslate: string) => Promise<void>;
  inputContainerRef: React.RefObject<HTMLDivElement>;
  translationChanged: React.MutableRefObject<boolean>;
  setFormFontSize: React.Dispatch<React.SetStateAction<number>>;
};

const TranslationForm = ({
  translate,
  inputContainerRef,
  translationChanged,
  setFormFontSize,
}: Props) => {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const checkEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) handleTranslation(e);
  };

  const handleTranslation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    translate(text);
  };

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    translationChanged.current = true;
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea === null) return;

    if (text.length > 150) {
      setFormFontSize(18);
      textArea.style.fontSize = 18 + "px";
    } else if (text.length > 50) {
      setFormFontSize(20);
      textArea.style.fontSize = 20 + "px";
    } else {
      setFormFontSize(24);
      textArea.style.fontSize = 24 + "px";
    }

    const container = inputContainerRef.current;
    if (container !== null) {
      container.style.height = "auto"; // resets the "height" of texarea allowing it to shrink when removing content
      container.style.height = `${textArea.scrollHeight + 100}px`; // set height to height of the content within textarea (that is the scrollHeight)
    }
  }, [text, inputContainerRef, setFormFontSize]);

  return (
    <form
      onSubmit={handleTranslation}
      onKeyDown={checkEnterPress}
      className="flex flex-col flex-1"
    >
      <textarea
        maxLength={3000}
        ref={textAreaRef}
        placeholder="hit enter or press translate to query. `Shift + Enter` for new line"
        value={text}
        onChange={handleText}
        className={`outline-none resize-none text-black w-full h-full p-5 pt-2 placeholder-slate-500 bg-inherit overflow-hidden ${lato.className} placeholder:text-2xl`}
      />
      <button
        type="submit"
        className={`text-white font-bold w-fit self-end bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
      >
        Translate
      </button>
    </form>
  );
};

export default TranslationForm;
