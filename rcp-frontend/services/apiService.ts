const BASE_URL = 'http://127.0.0.1:8000';

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

export const apiService = {
    post: async (url: string, data: any) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas dodawania');
        return result;
    },

    get: async (url: string) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas pobierania');
        return result;
    },

    patch: async (url: string, data: any) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas edycji');
        return result;
    },

    delete: async (url: string) => {
        const response = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (response.status === 204) {
            return true;
        }

        if (!response.ok) {
            let errorMessage = 'Coś poszło nie tak podczas usuwania';
            try {
                const result = await response.json();
                errorMessage = result.detail || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }

        return true;
    }
};
