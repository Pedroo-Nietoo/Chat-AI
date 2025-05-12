import { NextResponse } from 'next/server';

const url = "https://api.forefront.ai/v1/chat/completions";
const api_key = process.env.FOREFRONT_API_KEY;

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: "alpindale/Mistral-7B-v0.2-hf",
      messages,
      max_tokens: 64,
      temperature: 0.5,
    }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status, response.statusText);
      return new NextResponse(
        JSON.stringify({ error: "Erro na API externa", status: response.status }),
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Nenhuma resposta da IA" }),
        { status: 500 }
      );
    }

    let content = data.choices[0]?.message?.content;
    content = content.replace(/<\|im_end\|>\s*<\|im_start\|>/g, "").trim();

    return new NextResponse(JSON.stringify({ content }), { status: 200 });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return new NextResponse(JSON.stringify({ error: "O parâmetro 'username' é obrigatório" }), { status: 400 });
  }

  const githubUrl = `https://api.github.com/users/${username}`;

  try {
    const response = await fetch(githubUrl);

    if (!response.ok) {
      return new NextResponse(JSON.stringify({ error: "Usuário não encontrado no GitHub" }), { status: 404 });
    }

    const userData = await response.json();
    return new NextResponse(JSON.stringify(userData), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar dados do GitHub:", error);
    return new NextResponse(JSON.stringify({ error: "Erro interno no servidor" }), { status: 500 });
  }
}
