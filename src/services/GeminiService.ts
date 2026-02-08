import { GoogleGenAI, Type } from "@google/genai";
import type { CoachProfile } from '../utils/ProfileManager';

/**
 * Robustly strips any data URI prefix and returns only the raw base64 string.
 */
const cleanBase64 = (data: string): string | null => {
    if (!data) return null;
    const parts = data.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
};

export interface AnalysisResult {
    winner: 'home' | 'competitor' | 'tie';
    scores: {
        category: string;
        home: number;
        competitor: number;
        reasoning: string;
    }[];
    verdict: string;
    marketingCopy: {
        tiktok: string;
        linkedin: string;
        facebook: string;
    };
    hashtags: string[];
}

const getAIClient = (apiKey: string) => {
    const key = apiKey?.trim();
    if (!key) {
        throw new Error("API Key is missing. Please add your Google Gemini API Key in the Profile settings.");
    }
    return new GoogleGenAI({ apiKey: key });
};

export const GeminiService = {
    async analyzeProducts(
        apiKey: string,
        profile: CoachProfile,
        images: {
            homeFront: string;
            homeLabel: string;
            compFront: string;
            compLabel: string;
        },
        context: {
            homeContext: string;
            compContext: string;
        }
    ): Promise<AnalysisResult> {
        const ai = getAIClient(apiKey);
        const parts: any[] = [];

        const systemInstruction = `You are a world-class Nutritional Science Expert.
Compare the "Home Product" vs "Competitor Product" based on the provided label images.

CRITICAL RULES:
- DO NOT REPEAT phrases like "intent context favored by...". This is a bug you must avoid.
- PROVIDE DATA: Focus on specific mg/mcg values, bioavailability (citrate vs oxide), and non-GMO/Organic status.
- HONESTY: Acknowledge if the competitor is cheaper or has a higher dose of one specific thing, but explain why Home quality is superior overall.
- FORMAT: Always end every social post with exactly 5 relevant health hashtags.
- Personalize with Name: ${profile.name} and Link: ${profile.evaluationLink}.

Evaluation Framework:
1. Bioavailability: Check form (e.g., Citrate vs Oxide) and consider Additional Context.
2. Standardization: Guaranteed amounts vs Proprietary blends and consider Additional Context.
3. Purity & Quality: Look for testing certifications and consider Additional Context.

Strategic Bias: Favor Standardization and Quality Assurance. If Home Product has better stability, testing, or sourcing (as mentioned in context or images), award the win even if competitor has higher raw totals.

Return valid JSON.`;

        // Build image parts
        const imageTargets = [
            { img: images.homeFront, label: "Home Product Front" },
            { img: images.homeLabel, label: "Home Product Label" },
            { img: images.compFront, label: "Competitor Front" },
            { img: images.compLabel, label: "Competitor Label" }
        ];

        for (const item of imageTargets) {
            if (item.img) {
                const data = cleanBase64(item.img);
                if (data) {
                    parts.push({
                        inlineData: {
                            data,
                            mimeType: "image/jpeg"
                        }
                    });
                    parts.push({ text: item.label });
                }
            }
        }

        parts.push({
            text: `Compare these products. Home Context: ${context.homeContext || "High quality product"}. Competitor Context: ${context.compContext || "N/A"}.`
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        winner: { type: Type.STRING },
                        verdict: { type: Type.STRING },
                        scores: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING },
                                    home: { type: Type.NUMBER },
                                    competitor: { type: Type.NUMBER },
                                    reasoning: { type: Type.STRING }
                                },
                                required: ["category", "home", "competitor", "reasoning"]
                            }
                        },
                        marketingCopy: {
                            type: Type.OBJECT,
                            properties: {
                                facebook: { type: Type.STRING },
                                linkedin: { type: Type.STRING },
                                tiktok: { type: Type.STRING }
                            },
                            required: ["facebook", "linkedin", "tiktok"]
                        },
                        hashtags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["winner", "verdict", "scores", "marketingCopy", "hashtags"]
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as AnalysisResult;
        }
        throw new Error("Analysis failed. Try with clearer label images.");
    },

    async generateImagePrompt(analysis: AnalysisResult, profile: CoachProfile): Promise<string> {
        return `
      A high-fidelity 1:1 "Tale of the Tape" split-screen graphic comparing two health products.
      Left Side: Home Product with a 'Gold Aura' and 'Premium Spotlight' effect.
      Right Side: Competitor Product in neutral lighting.
      Text Overlay: "Winner: ${analysis.winner === 'home' ? 'Home Product' : 'Competitor'}"
      Footer Branding: "Expert Analysis by Coach ${profile.name}" integrated into the pixels.
      Style: Clean, professional, clinical laboratory aesthetic but with marketing energy.
    `.trim();
    }
};
