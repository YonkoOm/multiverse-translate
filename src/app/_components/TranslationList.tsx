import { Translation as TranslationType } from "../page";
import Translation from "./Translation";

type Props = {
  translations: TranslationType[];
  fontSize: number;
};

const TranslationList = ({ translations, fontSize }: Props) => {
  return (
    translations.length > 0 && (
      <div
        className="text-black gap-3 flex flex-col w-[300px] md:w-[400px] lg:w-[500px]"
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
    )
  );
};

export default TranslationList;
