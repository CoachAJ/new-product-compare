import type { CoachProfile } from '../utils/ProfileManager';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

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

export const GeminiService = {
    async analyzeProducts(
        apiKey: string,
        profile: CoachProfile,
        images: {
            homeFront: string;
            homeLabel: string;
            compFront: string;
            compLabel: string;
        }
    ): Promise<AnalysisResult> {
        const prompt = `
      Act as a Clinical Nutritionist and Marketing Expert. Compare these two health products.
      Home Product (Coach ${profile.name}): Visual branding and Label provided.
      Competitor Product: Visual branding and Label provided.

      Evaluation Framework:
      1. Bioavailability: Check form (e.g., Citrate vs Oxide).
      2. Standardization: Guaranteed amounts vs Proprietary blends.
      3. Purity & Quality: Look for testing certifications.

      Strategic Bias: Favor Standardization and Quality Assurance. If Home Product has better stability or testing, award the win even if competitor has higher raw totals.

      Anti-Looping Protocol: Be concise. No repetitive reasoning.

      Output Format (JSON strictly):
      {
        "winner": "home" | "competitor",
        "scores": [
          {"category": "Bioavailability", "home": 0-100, "competitor": 0-100, "reasoning": "..."},
          {"category": "Standardization", "home": 0-100, "competitor": 0-100, "reasoning": "..."},
          {"category": "Purity", "home": 0-100, "competitor": 0-100, "reasoning": "..."}
        ],
        "verdict": "Clear concise explanation of why the winner was chosen.",
        "marketingCopy": {
          "tiktok": "Short hook-heavy copy targeting Coach personalized link: ${profile.evaluationLink}",
          "linkedin": "Professional science-first breakdown targeting Coach personalized link: ${profile.evaluationLink}",
          "facebook": "Community focused, emoji rich targeting Coach personalized link: ${profile.evaluationLink}"
        },
        "hashtags": ["list EXACTLY 5 trending hashtags"]
      }
    `;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: images.homeFront.split(',')[1] } },
                        { inline_data: { mime_type: "image/jpeg", data: images.homeLabel.split(',')[1] } },
                        { inline_data: { mime_type: "image/jpeg", data: images.compFront.split(',')[1] } },
                        { inline_data: { mime_type: "image/jpeg", data: images.compLabel.split(',')[1] } }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) throw new Error('Gemini Analysis Failed');
        const result = await response.json();
        return JSON.parse(result.candidates[0].content.parts[0].text);
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
