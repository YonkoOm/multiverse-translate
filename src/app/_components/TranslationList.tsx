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
      className="text-black gap-3 flex flex-col w-4/5 sm:w-8/12 md:w-7/12 lg:w-[450px]"
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
      className={`text-black bg-[#E7DECD] text-xl sm:text-2xl rounded-lg w-4/5 sm:w-8/12 md:w-7/12 lg:w-[450px] h-[150px] flex p-2 justify-center items-center ${lato.className} opacity-60 text-opacity-60`}
    >
      translations will appear here
    </div>
  );
};

export default TranslationList;
