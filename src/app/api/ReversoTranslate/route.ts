export async function POST(req: Request) {
  const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0";
  const API_TRANSLATE = "https://api.reverso.net/translate/v1/translation";

  const { text, fromLang, toLang } = await req.json();

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
      from: "eng",
      to: "kor",
    }),
  };

  try {
    const res = await fetch(API_TRANSLATE, reqOptions);
    if (!res.ok) {
      throw new Error(`Failed to Translate: ${res.status} (${res.statusText})`);
    }

    const translatedData = await res.json();
    return Response.json({ translatedText: translatedData.translation[0] });
  } catch (e) {
    console.error((e as Error).message);
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
