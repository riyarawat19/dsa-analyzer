import OpenAI from "openai";

export const analyzeWithAI = async ({
  code,
  language,
  errorType,
  problemType,
  constraints,
  heuristicFindings,
  timeComplexity,
  spaceComplexity,
}) => {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion =
      await client.chat.completions.create({
        model: "deepseek/deepseek-chat-v3",

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content: `
You are a DSA code analyzer.

Return ONLY concise findings.

STRICT JSON FORMAT:
{
  "findings": [
    {
      "rule": "",
      "reason": "",
      "fix": "",
      "severity": "low|medium|high",
      "confidence": 0,
      "errorType": ""
    }
  ]
}

Rules:
- concise
- no markdown
- no extra text
- max 1 sentence per field
- only real issues`,
          },

          {
            role: "user",
            content: `
Language:
${language}

Problem Type:
${problemType}

Constraints:
${constraints}

Expected Error Type:
${errorType}

Time Complexity:
${timeComplexity}

Space Complexity:
${spaceComplexity}

Heuristic Findings:
${JSON.stringify(heuristicFindings)}

Code:
${code}
            `,
          },
        ],
      });

    const content =
      completion.choices[0].message.content;

    console.log("RAW AI RESPONSE:");
    console.log(content);

    return JSON.parse(content);

  } catch (error) {
    console.error("AI ERROR:", error);

    return {
      findings: [],
    };
  }
};