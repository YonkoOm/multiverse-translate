export async function POST(req: Request) {
  async function deepLWebTranslate(text: string, from: string, to: string) {
    const url = "https://www2.deepl.com/jsonrpc";
    const srcLang = languageCodeForLanguage(from);
    const targetLang = languageCodeForLanguage(to);

    const id = getRandomNumber();
    const iCount = getICount(text);
    const ts = getTimeStampWithIcount(iCount);

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

    let reqStr = JSON.stringify(reqBody);
    if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
      reqStr = reqStr.replace(/"method":"/, '"method" : "');
    } else {
      reqStr = reqStr.replace(/"method":"/, '"method": "');
    }

    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reqStr,
    };

    try {
      const res = await fetch(url, reqOptions);
      if (!res.ok) {
        throw new Error("Couldn't Translate :(");
      }

      const translationData = await res.json();
      const translatedText = translationData.result.texts[0].text.trim();
      const results = translatedText.split("\n");

      return results;
    } catch (error) {
      console.error("Error fetching translation:", error);
    }
  }

  function languageCodeForLanguage(language: string) {
    const languageCodes: { [key: string]: string } = {
      EN: "EN",
      KO: "KO",
      ZH: "ZH",
      AR: "AR",
      BG: "BG",
      CS: "CS",
      DA: "DA",
      DE: "DE",
      EL: "EL",
      ES: "ES",
      ET: "ET",
      FI: "FI",
      FR: "FR",
      HU: "HU",
      ID: "ID",
      IT: "IT",
      JA: "JA",
      LT: "LT",
      LV: "LV",
      NB: "NB",
      NL: "NL",
      PL: "PL",
      PT: "PT",
      RO: "RO",
      RU: "RU",
      SK: "SK",
      SL: "SL",
      SV: "SV",
      TR: "TR",
      UK: "UK",
    };

    return languageCodes[language] || null;
  }

  function getRandomNumber() {
    return Math.floor(Math.random() * 89999) + 100000;
  }

  function getICount(text: string) {
    return (text.match(/i/g) || []).length;
  }

  function getTimeStampWithIcount(iCount: number) {
    const ts = Date.now();
    if (iCount !== 0) {
      iCount += 1;
      return ts - (ts % iCount) + iCount;
    } else {
      return ts;
    }
  }

  const { text, fromLang, toLang } = await req.json();
  const translatedText = await deepLWebTranslate(text, fromLang, toLang);

  return Response.json({ translatedText });
}
