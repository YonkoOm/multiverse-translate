export async function POST(req: Request) {
  const { text, fromLang, toLang } = await req.json();

  try {
    const res = await fetch(
      `https://translate.google.com/translate_a/t?client=gtx&sl=${fromLang.toLowerCase()}&tl=${toLang.toLowerCase()}&q=${text}`,
    );
    const translationData = await res.json();
    if (!res.ok) {
      throw new Error(`Failed to Translate: ${res.status} (${res.statusText})`);
    }
    return Response.json({ translatedText: translationData[0] });
  } catch (e) {
    console.error((e as Error).message);
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
