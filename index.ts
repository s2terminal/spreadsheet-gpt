export function GPT(input: string, model: string = "gpt-3.5-turbo"): string {
  const URL = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Secrets.OPENAI_API_KEY}`
  };
  const body = {
    model,
    max_tokens: 100,
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
  return JSON.parse(response.getContentText()).choices[0].message.content;
}
