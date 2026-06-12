

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
    const prompt = `You are an expert Indian wedding photography marketing copywriter.

            Your task is to generate premium, emotional, customer-friendly content for a photography category named "${categoryName}".

            The content must feel natural, human-written, and emotionally engaging.

            Target Audience:

            * Indian couples
            * Families planning weddings
            * Pre-wedding clients
            * Destination wedding clients
            * Birthday and event clients
            * People looking for premium photography services

            Writing Style Requirements:

            * Use simple and easy-to-understand English.
            * Avoid robotic AI language.
            * Avoid generic marketing buzzwords.
            * Avoid overusing words like "capture memories", "timeless moments", "unforgettable experiences".
            * Write like an experienced photographer explaining services to a real customer.
            * Focus on emotions, trust, excitement, family moments, celebrations, and storytelling.
            * Content should feel premium but not complicated.
            * Use Indian wedding and event context wherever relevant.
            * Make the reader imagine their own event.

            Tone:

            * Warm
            * Professional
            * Friendly
            * Premium
            * Story-driven

            IMPORTANT:

            Return ONLY a raw JSON object.

            Do NOT return markdown.

            Do NOT return explanation text.

            Do NOT return code blocks.

            Return valid JSON only.

            The output MUST follow this exact schema:

            {
            "heroHeading": "Premium emotional headline under 60 characters",

            "shortDescription": "2-3 lines suitable for category cards and previews. Clear and customer-focused.",

            "fullDescription": "Write 3-5 detailed paragraphs explaining the category, what clients can expect, why it is valuable, and how it helps preserve important moments. Use natural storytelling.",

            "features": [
            "Client-friendly feature",
            "Client-friendly feature",
            "Client-friendly feature",
            "Client-friendly feature",
            "Client-friendly feature"
            ],

            "highlights": [
            "Strong selling point",
            "Strong selling point",
            "Strong selling point",
            "Strong selling point"
            ],

            "faq": [
            {
            "question": "Real customer question?",
            "answer": "Helpful answer"
            },
            {
            "question": "Real customer question?",
            "answer": "Helpful answer"
            },
            {
            "question": "Real customer question?",
            "answer": "Helpful answer"
            }
            ],

            "seoTitle": "SEO title under 60 characters",

            "seoDescription": "SEO description under 160 characters",

            "seoKeywords": "relevant Indian photography keywords separated by commas"
            }

            Additional Rules:

            * Make every category feel unique.
            * If category is Pre Wedding, talk about chemistry, storytelling, locations, candid moments.
            * If category is Wedding Photography, talk about rituals, emotions, family moments, celebrations.
            * If category is Birthday, focus on joy, family, children, decorations, celebrations.
            * If category is Maternity, focus on motherhood and emotional connection.
            * If category is Couple Shoot, focus on natural chemistry and candid moments.
            * If category is Destination Wedding, focus on travel, scenery, luxury experience.
            * Generate FAQs that customers genuinely ask before booking.
            * Features should explain actual value to customers, not technical photography terms.
            * Content should help increase booking conversions.
            * Content must feel like it was written by a premium Indian photography studio, not by AI.
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
    const prompt = `You are an award-winning Indian wedding photographer, pre-wedding specialist, and creative director with 15+ years of experience photographing weddings, engagements, haldi ceremonies, mehendi ceremonies, receptions, destination weddings, maternity shoots, birthday events, and family celebrations across India.

            Generate exactly ${count} unique photography poses for the category "${categoryName}".

            IMPORTANT CONTEXT:

            This is for an Indian photography studio.

            The poses MUST reflect realistic Indian photography practices.

            Avoid Western-style intimate poses.

            Avoid public kissing poses.

            Avoid overly romantic fashion-magazine concepts.

            Avoid unrealistic AI-generated pose names.

            The generated poses should be suitable for:

            * Indian couples
            * Wedding clients
            * Engagement clients
            * Pre-wedding shoots
            * Traditional families
            * Destination weddings
            * Social media sharing
            * Professional photography portfolios

            POSE STYLE REQUIREMENTS:

            Generate poses that are:

            * Natural
            * Elegant
            * Family-friendly
            * Romantic but respectful
            * Easy to perform
            * Commonly requested by Indian clients
            * Suitable for luxury photography studios

            Examples of good pose styles:

            * Walking Together
            * Hand Holding
            * Looking At Each Other
            * Bride Twirl
            * Groom Watching Bride
            * Mehendi Showcase
            * Dupatta Frame Portrait
            * Palace Walk
            * Laughing Together
            * Traditional Couple Portrait
            * Mandap Moments
            * Ring Exchange Moments
            * Bridal Entry Moments
            * Reception Stage Portrait
            * Couple Sitting Together
            * Bride Looking Over Shoulder
            * Groom Helping Bride Walk
            * Family Blessing Moments

            NAMING RULES:

            Pose names must be simple and professional.

            Examples:

            * Royal Palace Walk
            * Golden Hour Stroll
            * Dupatta Frame Portrait
            * Bride Twirl Moment
            * Hand In Hand Walk
            * Mandap Blessing Shot
            * Mehendi Showcase
            * Wedding Stage Portrait
            * Sunset Garden Walk
            * Royal Staircase Pose

            Avoid names like:

            * Eternal Passion
            * Midnight Seduction
            * Forbidden Romance
            * Cinematic Desire
            * Sunset Kiss Fantasy

            DESCRIPTION RULES:

            Write descriptions that explain:

            * What the final photo looks like
            * Why the pose looks beautiful
            * How it helps tell the couple's story

            BEST TIME:

            Only use realistic options:

            * Golden Hour
            * Morning Light
            * Mid-day
            * Indoor Soft Light
            * Blue Hour
            * Reception Lighting
            * Night Lighting

            BEST LENS:

            Only use:

            * 35mm
            * 50mm
            * 85mm
            * 70-200mm

            DIFFICULTY:

            Only use:

            * Easy
            * Medium
            * Hard

            SHOOTING TIPS:

            Provide practical photographer guidance.

            Examples:

            * Use natural side lighting
            * Focus on expressions
            * Shoot slightly below eye level
            * Use palace architecture for framing
            * Keep background clean

            COUPLE INSTRUCTIONS:

            Write exactly what a photographer would tell a client.

            Examples:

            * Walk slowly while holding hands
            * Look at each other and smile naturally
            * Bride gently adjust the dupatta
            * Groom look towards the bride

            PHOTOGRAPHER NOTES:

            Explain creative considerations.

            TAGS:

            Generate 3–5 meaningful tags.

            Examples:

            ["pre-wedding", "candid", "royal"]

            IMPORTANT:

            Return ONLY valid raw JSON.

            Do NOT return markdown.

            Do NOT return explanations.

            Do NOT return text outside JSON.

            Follow exactly this schema:

            {
            "poses": [
            {
            "poseName": "",
            "shortDescription": "",
            "bestTime": "",
            "bestLens": "",
            "difficulty": "",
            "shootingTips": "",
            "coupleInstructions": "",
            "photographerNotes": "",
            "tags": []
            }
            ]
            }

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
