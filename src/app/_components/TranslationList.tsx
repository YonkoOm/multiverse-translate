import { Translation as TranslationType } from "../page";
import { lato } from "../fonts";
import Translation from "./Translation";
import LoadingAnimation from "./LoadingAnimation";
import useWindowDimensions from "../hooks/useWindowDimensions";

type Props = {
  translations: TranslationType[];
  isLoading: boolean;
};

const TranslationList = ({ translations, isLoading }: Props) => {
  const { width } = useWindowDimensions();
  const maxLength = Math.max(...translations.map(({ text }) => text.length));
  const fontSize =
    maxLength > 150 || width < 640 ? 18 : maxLength > 50 ? 20 : 24;

  return !isLoading ? (
    translations.length > 0 ? (
      <div
        className="text-black gap-3 flex flex-col w-4/5 sm:w-9/12 md:w-8/12 lg:w-[450px]"
        style={{ fontSize }}
      >
        {translations.map((translation, i) => (
          <Translation
            key={translation.translator}
            translation={translation}
            translationIndex={i}
            showOnlyInitial={maxLength > 150}
          />
        ))}
      </div>
    ) : (
      <div
        className={`text-black bg-[#E7DECD] text-xl sm:text-2xl rounded-lg w-4/5 sm:w-9/12 md:w-8/12 lg:w-[450px] h-[150px] flex p-2 justify-center items-center ${lato.className} opacity-60 text-opacity-60`}
      >
        translations will appear here
      </div>
    )
  ) : (
    <LoadingAnimation />
  );
};

export default TranslationList;
