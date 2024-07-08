type TokenInfo = {
  token: string;
  tokenExpiresAt: number;
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
        // valid in 10 minutes
        tokenExpiresAt: jwtPayload.exp * 1e3,
      };
    } catch (e) {
      throw new Error("Failed to fetch auth token\n" + (e as Error).message);
    }
  };

  // consider the token as expired if the rest time is less than 1 minute
  const isTokenExpired = (token: TokenInfo) =>
    (token.tokenExpiresAt || 0) - Date.now() < 6e4;

  if (!globalToken || isTokenExpired(globalToken)) {
    try {
      globalToken = await fetchToken();
    } catch (e) {
      console.error((e as Error).message);
      return Response.json({ error: (e as Error).message }, { status: 500 });
    }
  }
  const { text, fromLang, toLang } = await req.json();

  if (!text || !text.length) {
    return;
  }

  const reqOptions = {
    method: "POST",
    headers: {
      "User-Agent": USER_AGENT,
      "Content-Type": "application/json",
      Authorization: "Bearer " + globalToken.token,
    },
    body: JSON.stringify([{ Text: text }]),
  };

  try {
    const res = await fetch(
      `${API_TRANSLATE}&from=${fromLang.toLowerCase()}&to=${toLang.toLowerCase()}`,
      reqOptions,
    );

    const translationData = await res.json();
    if (!res.ok) {
      throw new Error(
        `Failed to translate with status code: ${res.status} (${res.statusText})\n${JSON.stringify(translationData, null, 2)}`,
      );
    }

    return Response.json({
      translatedText: translationData[0].translations[0].text,
    });
  } catch (e) {
    console.log((e as Error).message);
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
