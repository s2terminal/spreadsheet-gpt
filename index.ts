// JSDocの記法の一部がスプレッドシートのオートコンプリートに反映される
/**
 * GPTを呼び出すカスタム関数
 *
 * @param {string} input GPTへの入力文字列
 * @param {model} model モデル名。デフォルトは"gpt-3.5-turbo"
 * @param {boolean} useCache キャッシュを使用するかどうか。長い入力を使う時はキャッシュを無効化する必要がある
 * @return GPTで生成した結果
 * @customfunction
 */
export function GPT(input: string, model: string = "gpt-3.5-turbo", useCache: boolean = true): string {
  // キャッシュから取得
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

  // OpenAI Chat Completion APIで生成
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
      method: "post",
      headers: headers,
      payload: JSON.stringify(body)
    }
  );
  const result = JSON.parse(response.getContentText()).choices[0].message.content;

  // キャッシュに保存
  if (useCache) {
    cache.put(input, result, 21600);
  }

  return result;
}
