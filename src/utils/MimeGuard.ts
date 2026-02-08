export const MIME_TYPES = ['image/jpeg', 'image/png'] as const;

export const MimeGuard = {
    isValidImage: (file: File): boolean => {
        return MIME_TYPES.includes(file.type as any);
    },

    validateFiles: (files: FileList | File[]): { valid: File[], invalid: string[] } => {
        const valid: File[] = [];
        const invalid: string[] = [];

        Array.from(files).forEach(file => {
            if (MimeGuard.isValidImage(file)) {
                valid.push(file);
            } else {
                invalid.push(`${file.name} is not a valid image (JPEG/PNG only)`);
            }
        });

        return { valid, invalid };
    },

    fileToBase64: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result as string;
                // Strip out the data:image/xxx;base64, part if needed for Gemini
                // resolve(base64.split(',')[1]);
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }
};
