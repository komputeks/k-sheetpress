import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// POST /api/ai/generate - Generate post content with AI
export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey, provider } = await req.json();
    if (!prompt || !apiKey) {
      return NextResponse.json({ error: 'prompt and apiKey are required' }, { status: 400 });
    }

    const aiProvider = provider || 'openai';
    let content = '';

    if (aiProvider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional blog post writer. Write engaging, well-structured content in Markdown format. Include headings, bullet points, and a compelling introduction.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json({ error: err?.error?.message || 'AI API request failed' }, { status: res.status });
      }

      const data = await res.json();
      content = data.choices?.[0]?.message?.content || '';
    } else {
      return NextResponse.json({ error: 'Unsupported AI provider. Use "openai".' }, { status: 400 });
    }

    // Generate a title from the prompt if the content doesn't have one
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : prompt.slice(0, 80);

    return NextResponse.json({ content, title });
  } catch (err) {
    console.error('AI generate error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'AI generation failed' }, { status: 500 });
  }
}
