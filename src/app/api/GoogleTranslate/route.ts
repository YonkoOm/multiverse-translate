import { supportedLanguages } from "../_utils/GoogleSupportedLanguages";

export async function POST(req: Request) {
  const { text, fromLang, toLang } = await req.json();

  const srcLang = supportedLanguages[fromLang] || "";
  const targetLang = supportedLanguages[toLang] || "";

  if (targetLang === "" && srcLang === "") {
    return Response.json(
      { error: `${fromLang} and ${toLang} not suppported` },
      { status: 400 },
    );
  } else if (srcLang === "") {
    return Response.json(
      { error: fromLang + " not suppported" },
      { status: 400 },
    );
  } else if (targetLang === "") {
    return Response.json(
      { error: toLang + " not suppported" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://translate.google.com/translate_a/t?client=gtx&sl=${srcLang}&tl=${targetLang}&q=${text}`,
    );

    if (!res.ok) {
      throw new Error(
        `Failed to Translate with Status Code: ${res.status} (${res.statusText})`,
      );
    }

    const translationData = await res.json();

    return Response.json({ translatedText: translationData[0] });
  } catch (e) {
    console.error((e as Error).message);
    return Response.json(
      { error: "translation failed 😭... try again!" },
      { status: 500 },
    );
  }
}
