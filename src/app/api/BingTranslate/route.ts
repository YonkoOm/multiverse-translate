import { supportedLanguages } from "@/constants/api/BingSupportedLanguages";

type TokenInfo = {
  token: string;
  expirationTime: number;
};

let globalToken: TokenInfo;

export async function POST(req: Request) {
  const API_AUTH = "https://edge.microsoft.com/translate/auth";
  const API_TRANSLATE =
    "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"; // api version value must be 3.0
  const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0";

  const fetchToken = async (): Promise<TokenInfo> => {
    try {
      const auth = await fetch(API_AUTH, {
        headers: {
          "User-Agent": USER_AGENT,
        },
      });
      if (!auth.ok) throw new Error(`${auth.status} (${auth.statusText})`);
      const authJWT = await auth.text();

      const jwtPayload = JSON.parse(
        Buffer.from(authJWT.split(".")[1], "base64").toString("utf-8"),
      );

      return {
        token: authJWT,
        expirationTime: jwtPayload.exp * 1e3,
      };
    } catch (e) {
      throw new Error("Failed to fetch auth token\n" + (e as Error).message);
    }
  };

  // token expired if expiration times is in less than a minute
  const isTokenExpired = (token: TokenInfo) =>
    (token.expirationTime || 0) - Date.now() < 6e4;

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
    if (!globalToken || isTokenExpired(globalToken)) {
      globalToken = await fetchToken();
    }

    const reqOptions: RequestInit = {
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        Authorization: "Bearer " + globalToken.token,
      },
      body: JSON.stringify([{ Text: text }]),
    };

    const res = await fetch(
      `${API_TRANSLATE}&from=${srcLang}&to=${targetLang}`,
      reqOptions,
    );

    if (!res.ok) {
      const body = await res.json();
      throw new Error(
        `Failed to translate with status code: ${res.status} (${res.statusText})\n${JSON.stringify(body, null, 2)}`,
      );
    }

    const translationData = await res.json();
    return Response.json({
      translatedText: translationData[0].translations[0].text,
    });
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
