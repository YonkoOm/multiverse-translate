import { useState, useRef, useEffect } from "react";
import { mplus, lato } from "../fonts";

type Props = {
  inputContainerRef: React.RefObject<HTMLDivElement>;
  fontSize: React.MutableRefObject<number | null>;
  translationChanged: React.MutableRefObject<boolean>;
  translate: (text: string) => Promise<void>;
};

export default function TranslationForm({
  inputContainerRef,
  translate,
  fontSize,
  translationChanged,
}: Props) {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const checkEnterPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key == "Enter" && !e.shiftKey) handleTranslation(e);
  };

  const handleTranslation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    translate(text);
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea === null) return;

    if (text.length > 450) {
      fontSize.current = 18;
    } else if (text.length > 300) {
      fontSize.current = 20;
    } else if (text.length > 200) {
      fontSize.current = 22;
    } else if (text.length > 100) {
      fontSize.current = 24;
    } else {
      fontSize.current = 26;
    }
    textArea.style.fontSize = fontSize.current + "px";

    const container = inputContainerRef.current;
    if (container !== null) {
      container.style.height = "auto"; // resets the "height" of texarea allowing it to shrink when removing content
      container.style.height = `${textArea.scrollHeight + 100}px`; // set height to height of the content within textarea (that is the scrollHeight)
    }
  }, [text, inputContainerRef, fontSize]);

  return (
    <form
      onSubmit={handleTranslation}
      onKeyDown={checkEnterPress}
      className="flex flex-col flex-1"
    >
      <textarea
        ref={textAreaRef}
        placeholder="hit enter or press translate to query. `Shift + Enter` for new line"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          translationChanged.current = true;
        }}
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
}
