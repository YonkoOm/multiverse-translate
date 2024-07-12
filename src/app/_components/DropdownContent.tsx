import { languages } from "../_utils/languages";
import { lato } from "../fonts";

type Props = {
  activeLang: string;
  toggleDropdown: (lang: string) => void;
};

export default function DropDownContent({ activeLang, toggleDropdown }: Props) {
  return (
    <div className="rounded-xl absolute w-full h-full z-10 overflow-hidden">
      <div
        className={`grid grid-cols-3 gap-y-1 bg-[#E7DECD] ${lato.className} text-base rounded-xl p-2 overflow-y-auto h-full w-full`}
      >
        {Object.keys(languages).map((lang) => (
          <div
            className={`w-44 h-fit cursor-pointer hover:bg-[#8F99FB]/50 rounded-md p-0.5 pl-2 pr-5 ${lang == activeLang ? "bg-[#8F99FB]/50" : ""}`}
            key={lang}
            onClick={() => toggleDropdown(lang)}
          >
            {languages[lang]}
          </div>
        ))}
      </div>
    </div>
  );
}
