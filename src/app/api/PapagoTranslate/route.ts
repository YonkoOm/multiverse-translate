export async function POST(req: Request) {
  const url = "https://api.papago-chrome.com/v2/translate/openapi";
  const header = {
    "Content-Type": "application/json; charset=UTF-8",
    Host: "api.papago-chrome.com",
    accept: "application/json, text/javascript, */*; q=0.01",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    origin: "chrome-extension://enddgifdbfoefnelepppgaabobdfbcpe",
    "sec-fetch-site": "cross-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
  };

  const { text, fromLang, toLang } = await req.json();
  console.log(text, fromLang, toLang);

  const requestOptions = {
    method: "POST",
    headers: header,
    body: JSON.stringify({
      source: fromLang.toLowerCase(),
      target: toLang.toLowerCase(),
      text: text,
    }),
  };

  const res = await fetch(url, requestOptions);
  console.log(res);
}
