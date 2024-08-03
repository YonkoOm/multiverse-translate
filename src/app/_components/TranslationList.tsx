import { Translation as TranslationType } from "../page";
import { lato } from "../fonts";
import Translation from "./Translation";
import LoadingAnimation from "./LoadingAnimation";
import useWindowDimensions from "../_hooks/useWindowDimensions";

type Props = {
  translations: TranslationType[];
  isLoading: boolean;
};

const TranslationList = ({ translations, isLoading }: Props) => {
  const { width } = useWindowDimensions();
  const maxLength = Math.max(...translations.map(({ text }) => text.length));
  const fontSize =
    maxLength > 150 || width < 640 ? 18 : maxLength > 50 ? 20 : 24;

  return (
    <div
      className={`text-black w-4/5 sm:w-9/12 md:w-8/12 lg:w-[450px] ${lato.className}`}
    >
      {!isLoading ? (
        translations.length > 0 ? (
          <div className="gap-3 flex flex-col" style={{ fontSize }}>
            {translations.map((translation, i) => (
              <Translation
                key={translation.translator}
                translation={translation}
                translationIndex={i}
                isShownInitially={maxLength < 150 || i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#E7DECD] text-xl sm:text-2xl rounded-lg h-[150px] flex justify-center items-center text-center opacity-50 text-opacity-50">
            translations will appear here
          </div>
        )
      ) : (
        <LoadingAnimation />
      )}
    </div>
  );
};

export default TranslationList;
