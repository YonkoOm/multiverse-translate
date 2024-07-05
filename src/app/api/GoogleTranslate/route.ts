export async function POST(req: Request) {
  const { text, fromLang, toLang } = await req.json();

  const res = await fetch(
    `https://translate.google.com/translate_a/t?client=gtx&sl=${fromLang.toLowerCase()}&tl=${toLang.toLowerCase()}&q=${text}`,
  );
  const translationData = await res.json();

  return Response.json({ translatedText: translationData[0] });
}
