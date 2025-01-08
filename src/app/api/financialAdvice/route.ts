import openai from "@/lib/openaiClient";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a financial advisor." },
        { role: "user", content: query },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify({ advice: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch financial advice." }),
      { status: 500 }
    );
  }
}
