import { Translation as TranslationType } from "../page";
import Translation from "./Translation";

type Props = {
  translations: TranslationType[];
  fontSize: number;
};

const TranslationList = ({ translations, fontSize }: Props) => {
  return (
    <div className="text-black gap-3 flex flex-col" style={{ fontSize }}>
      {translations.map((translation, i) => (
        <Translation
          key={translation.translator}
          translation={translation}
          itemIndex={i}
          fontSize={fontSize}
        />
      ))}
    </div>
  );
};

export default TranslationList;
