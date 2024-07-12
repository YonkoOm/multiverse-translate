import { Translator } from "../page";
import { mplus, lato } from "../fonts";

type Props = {
  translations: Translator[];
};
export default function Translations({ translations }: Props) {
  return (
    <div className="text-black gap-3 flex flex-col">
      {translations.map((text, i) => (
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
  );
}
