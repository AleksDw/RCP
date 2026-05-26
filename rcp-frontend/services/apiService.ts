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

const refreshAccessToken = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    const refresh = localStorage.getItem('refresh');
    if (!refresh) return false;

    try {
        const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        });

        const data = await response.json();
        if (!response.ok || !data.access) {
            return false;
        }

        localStorage.setItem('access', data.access);
        return true;
    } catch (e) {
        return false;
    }
}

const fetchWithAuth = async (url: string, options: RequestInit, retry = true) => {
    let response = await fetch(`${BASE_URL}${url}`, options);

    if (response.status === 401 && retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            options.headers = getHeaders();
            response = await fetch(`${BASE_URL}${url}`, options);
        }
    }

    return response;
};

export const apiService = {
    post: async (url: string, data: any) => {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas dodawania');
        return result;
    },

    get: async (url: string) => {
        const response = await fetchWithAuth(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas pobierania');
        return result;
    },

    patch: async (url: string, data: any) => {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Coś poszło nie tak podczas edycji');
        return result;
    },

    delete: async (url: string) => {
        const response = await fetchWithAuth(url, {
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
