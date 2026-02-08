
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ProductData, ComparisonAnalysis, ImageSize } from "../types";

/**
 * Robustly strips any data URI prefix and returns only the raw base64 string.
 */
const cleanBase64 = (data: string) => {
  if (!data) return null;
  const parts = data.split(',');
  return parts.length > 1 ? parts[1].trim() : parts[0].trim();
};

const getMimeType = (data: string) => {
  const match = data.match(/^data:([^;]+);base64,/);
  return match ? match[1] : "image/jpeg";
};

const getAIClient = (userProfile: UserProfile) => {
  const apiKey = userProfile.apiKey?.trim() || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Google Gemini API Key in the Profile settings.");
  }
  return new GoogleGenAI({ apiKey });
}

export const analyzeProducts = async (
  homeProduct: ProductData,
  competitorProduct: ProductData,
  userProfile: UserProfile
): Promise<ComparisonAnalysis> => {
  const ai = getAIClient(userProfile);
  const parts: any[] = [];

  const systemInstruction = `You are a world-class Nutritional Science Expert.
  Compare "${homeProduct.name}" (Home) vs "${competitorProduct.name}" (Competitor).

  CRITICAL RULES:
  - DO NOT REPEAT phrases like "intent context favored by...". This is a bug you must avoid.
  - PROVIDE DATA: Focus on specific mg/mcg values, bioavailability (citrate vs oxide), and non-GMO/Organic status.
  - HONESTY: Acknowledge if the competitor is cheaper or has a higher dose of one specific thing, but explain why Home quality is superior overall.
  - FORMAT: Always end every social post with exactly 5 relevant health hashtags.
  - Personalize with Name: ${userProfile.name} and Link: ${userProfile.evalLink}.
  
  Return valid JSON.`;

  // Use only necessary images for analysis to keep payload small
  const targets = [
    { img: homeProduct.ingredientsImage, label: "Home Label" },
    { img: competitorProduct.ingredientsImage, label: "Competitor Label" }
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
    text: `Compare these products. Home: ${homeProduct.notes || "High quality"}. Comp: ${competitorProduct.notes || "N/A"}. Comp Price: ${competitorProduct.price || "N/A"}.`
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: { parts },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING },
          summary: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          scoreHome: { type: Type.NUMBER },
          scoreCompetitor: { type: Type.NUMBER },
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
          socialCopy: {
            type: Type.OBJECT,
            properties: {
              facebook: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              twitter: { type: Type.STRING },
              youtube: { type: Type.STRING },
              tiktok: { type: Type.STRING }
            },
            required: ["facebook", "linkedin", "twitter", "youtube", "tiktok"]
          }
        },
        required: ["verdict", "summary", "pros", "cons", "scoreHome", "scoreCompetitor", "nutrientComparison", "socialCopy"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as ComparisonAnalysis;
  }
  throw new Error("Analysis failed. Try with clearer label images.");
};

export const generateMarketingImage = async (
  homeProduct: ProductData,
  competitorProduct: ProductData,
  userProfile: UserProfile,
  size: ImageSize,
  winner: 'home' | 'competitor'
): Promise<string> => {
  const ai = getAIClient(userProfile);
  const parts: any[] = [];

  // To avoid 500 errors or size limit issues, we send at most one reference image
  if (homeProduct.productImage) {
    const data = cleanBase64(homeProduct.productImage);
    if (data) {
      parts.push({ inlineData: { data, mimeType: "image/jpeg" } });
    }
  }

  const isProModel = size === ImageSize.SIZE_2K || size === ImageSize.SIZE_4K;
  const modelToUse = isProModel ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

  const winnerName = winner === 'home' ? homeProduct.name : competitorProduct.name;
  
  const prompt = `Create a professional "Side-by-Side Comparison" marketing graphic.
  LEFT SIDE: Show a product that looks like the provided image (${homeProduct.name}).
  RIGHT SIDE: Show a generic competitor product labeled "${competitorProduct.name}".
  CENTER: A high-contrast "VS" badge.
  WINNER HIGHLIGHT: The ${winner === 'home' ? 'LEFT' : 'RIGHT'} side should have a vibrant golden glow and 5 stars.
  FOOTER TEXT: "Scientific Review by ${userProfile.name}".
  PALETTE: Clean white clinical background with teal and gold accents. 
  STYLE: High-end 3D product photography, 8k resolution, commercial grade.`;

  parts.push({ text: prompt });

  const imageConfig: any = {
    aspectRatio: "1:1"
  };

  // Only gemini-3-pro-image-preview supports imageSize
  if (isProModel) {
    imageConfig.imageSize = size;
  }

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents: { parts: parts },
    config: {
      imageConfig
    }
  });

  // Find the generated image in the response parts
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Model failed to generate the image. Try using the default 1K resolution.");
};
