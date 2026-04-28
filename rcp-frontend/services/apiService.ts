const BASE_URL = 'http://127.0.0.1:8000';

export const apiService = {
    post: async (url: string, data: any) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || 'Coś poszło nie tak');
        }

        return result;
    }
};