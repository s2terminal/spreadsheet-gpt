export function GPT(input: string, model: string = "gpt-3.5-turbo", useCache: boolean = true): string {
  const cache = CacheService.getScriptCache();

  if (useCache) {
    try {
      const cachedResult = cache.get(input);
      if (cachedResult) {
        return cachedResult;
      }
    } catch (e) {
      if (e.message.includes("Argument too large: key")) {
        throw new Error("キャッシュの取得に失敗しました。入力を短くするか、キャッシュを無効にしてください。");
      } else {
        throw e;
      }
    }
  }

  const URL = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Secrets.OPENAI_API_KEY}`
  };
  const body = {
    model,
    // max_tokens: 100,
    messages: [{ role: "user", content: input }],
  }
  const response = UrlFetchApp.fetch(
    URL,
    {
      method: "POST",
      headers: headers,
      payload: JSON.stringify(body)
    }
  );
  const result = JSON.parse(response.getContentText()).choices[0].message.content;

  if (useCache) {
    cache.put(input, result, 21600);
  }

  return result;
}
