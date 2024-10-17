import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const command = new InvokeModelCommand({
      body: JSON.stringify({
        prompt: `Human: Analyze the sentiment of the following text. Respond with only a sentiment label (very positive, positive, neutral, negative, or very negative) and a score between 0 and 1, should be a double, separated by a pipe character.  Do not include any additional information or explanations. For example: "0.8 | positive"

Text to analyze: "${text}"`,
        temperature: 0.7,
      }),
      modelId: "mistral.mistral-7b-instruct-v0:2",
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await bedrockClient.send(command);
    const responseBody = Buffer.from(response.body).toString('utf-8');
    const result = JSON.parse(responseBody);
    console.log("Result:", result);

    const generatedText = result.outputs?.[0]?.text || '';
    const { sentiment, score } = extractSentimentAndScore(generatedText);

    return NextResponse.json({ sentiment, score });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: 'Error analyzing sentiment' }, { status: 500 });
  }
}

function extractSentimentAndScore(text: string): { sentiment: string, score: number } {
  const parts = text.split('|').map(s => s.trim());
  let scoreStr = parts[0]?.split(':').pop()?.trim() || '0.5';
  let sentiment = parts[1]?.toLowerCase() || 'neutral';

  scoreStr = scoreStr.replace('Sentiment:', '').trim();
  const score = parseFloat(scoreStr);
  
  return {
    sentiment: sentiment,
    score: isNaN(score) ? 0.5 : score
  };
}