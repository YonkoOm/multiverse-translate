import Image from "next/image";
import { languages } from "../_utils/languages";
import { mplus } from "../fonts";
import { useState } from "react";
import DropDownContent from "./DropdownContent";

type Props = {
  fromLang: string;
  toLang: string;
  setFromLang: React.Dispatch<React.SetStateAction<string>>;
  setToLang: React.Dispatch<React.SetStateAction<string>>;
};

export default function Dropdown({
  fromLang,
  toLang,
  setFromLang,
  setToLang,
}: Props) {
  const [toLangDropIsOpen, setToLangDropIsOpen] = useState(false);
  const [fromLangDropIsOpen, setLangDropFromIsOpen] = useState(false);

  const toggleDropdown = (lang: string) => {
    if (fromLangDropIsOpen) {
      setFromLang(lang);
      setLangDropFromIsOpen(false);
    }
    if (toLangDropIsOpen) {
      setToLang(lang);
      setToLangDropIsOpen(false);
    }
  };

  return (
    <>
      <div className={`flex flex-row w-full ${mplus.className} text-base`}>
        <div
          className={
            "text-white w-fit flex gap-x-[6px] bg-[#677DB7] cursor-pointer p-3 shadow rounded-tl-xl font-bold"
          }
          onClick={() => setLangDropFromIsOpen(!fromLangDropIsOpen)}
        >
          <div>{languages[fromLang]}</div>
          <div
            className={`w-[14px] ${fromLangDropIsOpen ? "rotate-180" : "rotate-0"}`}
          >
            <Image src="/down-chevron.svg" alt="chevron" fill />
          </div>
        </div>
        <div
          className="text-white flex gap-x-[6px] ml-auto bg-[#677DB7] cursor-pointer p-3 shadow rounded-tr-xl font-bold"
          onClick={() => setToLangDropIsOpen(!toLangDropIsOpen)}
        >
          <div>{languages[toLang]}</div>
          <div
            className={`w-[14px] ${toLangDropIsOpen ? "rotate-180" : "rotate-0"}`}
          >
            <Image src="/down-chevron.svg" alt="chevron" fill />
          </div>
        </div>
      </div>
      {fromLangDropIsOpen || toLangDropIsOpen ? (
        <DropDownContent
          activeLang={fromLangDropIsOpen ? fromLang : toLang}
          toggleDropdown={toggleDropdown}
        />
      ) : (
        <></>
      )}
    </>
  );
}
