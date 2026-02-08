export interface CoachProfile {
    name: string;
    evaluationLink: string;
    cta: string;
    apiKey: string;
}

const STORAGE_KEY = 'health_compare_ai_profile';

export const ProfileManager = {
    saveProfile: (profile: CoachProfile) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    },

    getProfile: (): CoachProfile | null => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    clearProfile: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    isConfigured: (): boolean => {
        const profile = ProfileManager.getProfile();
        return !!(profile && profile.name && profile.apiKey);
    }
};
