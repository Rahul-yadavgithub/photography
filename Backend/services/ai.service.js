

/**
 * Utility to extract a JSON object from a string that might contain markdown or preamble text.
 */
function extractJSON(text) {
    // Attempt to find the first '{' and the last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start === -1 || end === -1 || start > end) {
        throw new Error("No JSON object found in response");
    }
    
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
}

export const generateCategoryContentService = async (categoryName) => {
    const prompt = `You are an expert marketing copywriter for a premium photography studio. 
Generate engaging, SEO-optimized content for a photography category named "${categoryName}".

IMPORTANT: You must return ONLY a raw JSON object. Do not wrap it in markdown block quotes (e.g., no \`\`\`json). Do not add any preamble or postscript text. Just the JSON object.

The output MUST have the exact following schema:
{
  "heroHeading": "A catchy, premium hero heading (max 60 chars)",
  "shortDescription": "2-3 lines short description for cards",
  "fullDescription": "A detailed, multi-paragraph description of the category",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "faq": [
    { "question": "Relevant question 1?", "answer": "Answer 1" },
    { "question": "Relevant question 2?", "answer": "Answer 2" },
    { "question": "Relevant question 3?", "answer": "Answer 3" }
  ],
  "seoTitle": "SEO optimized title (max 60 chars)",
  "seoDescription": "SEO optimized meta description (max 160 chars)",
  "seoKeywords": "keyword1, keyword2, keyword3, keyword4"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-120b:free",
            messages: [
                { role: "user", content: prompt }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    try {
        const parsedContent = extractJSON(content);
        return parsedContent;
    } catch (err) {
        console.error("Failed to parse JSON from AI response:", content);
        throw new Error("AI returned malformed JSON. Please try generating again.");
    }
};

export const generatePosesService = async (categoryName, count = 10) => {
    const prompt = `You are a world-class professional wedding photographer and creative director. 
Generate exactly ${count} unique, high-end photography poses for a category named "${categoryName}".

IMPORTANT: You must return ONLY a raw JSON object. Do not wrap it in markdown block quotes (e.g., no \`\`\`json). Do not add any preamble or postscript text. Just the JSON object.

The output MUST have the exact following schema:
{
  "poses": [
    {
      "poseName": "Catchy, professional name for the pose",
      "shortDescription": "1-2 lines describing the visual result",
      "bestTime": "e.g., Golden Hour, Blue Hour, Mid-day, Night",
      "bestLens": "e.g., 35mm, 50mm, 85mm, 70-200mm",
      "difficulty": "Easy, Medium, Hard, or Advanced",
      "shootingTips": "Technical advice for the photographer (lighting, angle, composition)",
      "coupleInstructions": "Direct instructions to give to the subjects",
      "photographerNotes": "Additional artistic or practical context",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-120b:free",
            messages: [
                { role: "user", content: prompt }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    try {
        const parsedContent = extractJSON(content);
        if (!parsedContent.poses || !Array.isArray(parsedContent.poses)) {
            throw new Error("Missing 'poses' array in JSON response");
        }
        return parsedContent;
    } catch (err) {
        console.error("Failed to parse JSON from AI response:", content);
        throw new Error("AI returned malformed JSON. Please try generating again.");
    }
};
