import axios from "axios";

export default defineLazyEventHandler(async () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) throw new Error("Missing OpenAI API key");

  return defineEventHandler(async (event) => {
    // Extract the `prompt` from the body of the request
    const { messages } = (await readBody(event)) as {
      messages: string;
    };
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt: messages,
          model: "text-davinci-003",
          max_tokens: 50, // Number of tokens (words/characters) you want to generate
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0]?.text.trim();
    } catch (error) {
      console.error("Error fetching completion:", error);
      return "";
    }
  });
});
