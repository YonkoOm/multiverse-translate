import { Translation as TranslationType } from "../page";
import { lato } from "../fonts";
import Translation from "./Translation";

type Props = {
  translations: TranslationType[];
  fontSize: number;
};

const TranslationList = ({ translations, fontSize }: Props) => {
  return translations.length > 0 ? (
    <div
      className="text-black gap-3 flex flex-col w-4/5 sm:w-[425px] md:w-[450px]"
      style={{ fontSize }}
    >
      {translations.map((translation, i) => (
        <Translation
          key={translation.translator}
          translation={translation}
          itemIndex={i}
          fontSize={fontSize}
        />
      ))}
    </div>
  ) : (
    <div
      className={`text-black gap-3 bg-[#E7DECD] w-4/5 text-xl sm:text-2xl rounded-lg sm:w-[425px] md:w-[450px] h-[150px] flex p-2 justify-center items-center ${lato.className} opacity-60 text-opacity-60`}
    >
      translations will appear here
    </div>
  );
};

export default TranslationList;
