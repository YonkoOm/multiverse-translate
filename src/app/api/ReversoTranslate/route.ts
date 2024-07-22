import { supportedLanguages } from "../_utils/ReversoSupportedLanguages";

export async function POST(req: Request) {
  const API_TRANSLATE = "https://api.reverso.net/translate/v1/translation";
  const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0";

  const { text, fromLang, toLang } = await req.json();

  const srcLang = supportedLanguages[fromLang] || "";
  const targetLang = supportedLanguages[toLang] || "";

  if (srcLang === targetLang) {
    return Response.json(
      { error: "Cannot translate the same language 🙃" },
      { status: 400 },
    );
  } else if (targetLang === "" && srcLang === "") {
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

  const reqOptions: RequestInit = {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      format: "text",
      input: text,
      options: {
        contextResults: true,
        languageDetection: true,
        origin: "reversomobile",
        sentenceSplitter: false,
      },
      from: srcLang,
      to: targetLang,
    }),
  };

  try {
    const res = await fetch(API_TRANSLATE, reqOptions);

    if (!res.ok) {
      throw new Error(
        `Failed to Translate with Status Code: ${res.status} (${res.statusText})`,
      );
    }

    const translatedData = await res.json();

    return Response.json({ translatedText: translatedData.translation[0] });
  } catch (e) {
    console.error((e as Error).message);
    return Response.json(
      {
        error:
          "Translation failed. Please try again. If the issue persists, please try again later",
      },
      { status: 500 },
    );
  }
}
