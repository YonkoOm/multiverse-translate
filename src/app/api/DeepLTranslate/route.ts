import {
  sourceLanguages,
  targetLanguages,
} from "@/constants/api/DeepLSupportedLanguages";

export async function POST(req: Request) {
  const getRandomNumber = () => Math.floor(Math.random() * 89999) + 100000;

  const getICount = (text: string) => (text.match(/i/g) || []).length;

  const getTimeStampWithICount = (iCount: number) => {
    const ts = Date.now();
    if (iCount !== 0) {
      iCount += 1;
      return ts - (ts % iCount) + iCount;
    } else {
      return ts;
    }
  };

  const API_TRANSLATE = "https://www2.deepl.com/jsonrpc";

  const { text, fromLang, toLang } = await req.json();

  const srcLang = sourceLanguages[fromLang] || "";
  const targetLang = targetLanguages[toLang] || "";

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

  const id = getRandomNumber();
  const iCount = getICount(text);
  const ts = getTimeStampWithICount(iCount);

  const params = {
    texts: [{ text: text, requestAlternatives: 3 }],
    splitting: "newlines",
    lang: {
      source_lang_user_selected: srcLang,
      target_lang: targetLang,
    },
    timestamp: ts,
  };

  const reqBody = {
    jsonrpc: "2.0",
    method: "LMT_handle_texts",
    id: id,
    params: params,
  };

  let reqJSON = JSON.stringify(reqBody);
  if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
    reqJSON = reqJSON.replace(/"method":"/, '"method" : "');
  } else {
    reqJSON = reqJSON.replace(/"method":"/, '"method": "');
  }

  const reqOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: reqJSON,
  };

  try {
    const res = await fetch(API_TRANSLATE, reqOptions);

    if (!res.ok) {
      if (res.status == 529) {
        return Response.json({ error: res.statusText }, { status: res.status });
      }
      throw new Error(
        `Failed to Translate with Status Code: ${res.status} (${res.statusText})`,
      );
    }

    const translationData = await res.json();
    const translatedText: string = translationData.result.texts[0].text.trim();
    const results: string[] = translatedText.split("\n");

    return Response.json({ translatedText: results[0] });
  } catch (e: any) {
    console.error(e.message);
    return Response.json(
      {
        error:
          "Translation failed. Please try again. If the issue persists, please try again later",
      },
      { status: 500 },
    );
  }
}
