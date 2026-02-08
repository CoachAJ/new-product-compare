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
    summary: string;
    pros: string[];
    cons: string[];
    scoreHome: number;
    scoreCompetitor: number;
    nutrientComparison: {
        nutrient: string;
        homeValue: string;
        competitorValue: string;
        advantage: 'home' | 'competitor' | 'neutral';
    }[];
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
Compare "Home Product" vs "Competitor Product" based on the label images.

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

Return valid JSON.`;

        // KEY OPTIMIZATION: Only send the LABEL images (2 total) to reduce token usage
        // This is what makes the analysis work without hitting token limits
        const targets = [
            { img: images.homeLabel, label: "Home Product Label" },
            { img: images.compLabel, label: "Competitor Product Label" }
        ];

        for (const item of targets) {
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
            text: `Compare these products. Home: ${context.homeContext || "High quality product"}. Competitor: ${context.compContext || "N/A"}.`
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
                        summary: { type: Type.STRING },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                        scoreHome: { type: Type.NUMBER },
                        scoreCompetitor: { type: Type.NUMBER },
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
                        nutrientComparison: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    nutrient: { type: Type.STRING },
                                    homeValue: { type: Type.STRING },
                                    competitorValue: { type: Type.STRING },
                                    advantage: { type: Type.STRING, enum: ["home", "competitor", "neutral"] }
                                }
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
                    required: ["winner", "verdict", "summary", "pros", "cons", "scoreHome", "scoreCompetitor", "scores", "nutrientComparison", "marketingCopy", "hashtags"]
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
