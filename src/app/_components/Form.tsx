import { useEffect, useRef, useState } from "react";
import { mplus, lato } from "../fonts";

type Props = {
  translate: (fromLang: string, toLang: string, text: string) => Promise<void>;
  setFormFontSize: React.Dispatch<React.SetStateAction<number>>;
  toLang: string;
  fromLang: string;
};
const Form = ({ translate, setFormFontSize, fromLang, toLang }: Props) => {
  const [text, setText] = useState("");
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

    const handleResize = () => {
      // handling the font size
      if (text.length > 150 || window.innerWidth < 640) {
        setFormFontSize(18);
        textArea.style.fontSize = 18 + "px";
      } else if (text.length > 50) {
        setFormFontSize(20);
        textArea.style.fontSize = 20 + "px";
      } else {
        setFormFontSize(24);
        textArea.style.fontSize = 24 + "px";
      }

      // dynamically resize the text area as content increases
      textArea.style.height = "auto"; // resets the "height" of text area allowing it to shrink when removing content
      textArea.style.height = `${textArea.scrollHeight}px`; // set height to height of the content within text area (that is the scrollHeight)
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [text, setFormFontSize]);

  useEffect(() => {
    translationChanged.current = true;
  }, [fromLang, toLang]);

  return (
    <form
      onSubmit={handleTranslation}
      onKeyDown={checkEnterPress}
      className="flex flex-col"
    >
      <textarea
        maxLength={3000}
        ref={textAreaRef}
        placeholder="hit enter or press translate to query. `Shift + Enter` for new line"
        value={text}
        onChange={handleText}
        className={`min-h-[250px] md:min-h-[350px] outline-none resize-none text-black w-full h-full p-5 pt-2 placeholder-slate-500 bg-inherit overflow-hidden ${lato.className} text-xl placeholder:text-xl lg:placeholder:text-2xl`} // min height used as we are dynamically resizing the text area based on content
      />
      <button
        type="submit"
        className={`self-end text-white font-bold w-fit bg-[#677DB7] hover:bg-[#677DB7]/90 p-2 rounded-tl-lg rounded-br-xl ${mplus.className}`}
      >
        Translate
      </button>
    </form>
  );
};

export default Form;
