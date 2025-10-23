type Json = Record<string, unknown>;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);

    }
    if (res.status === 204) return {} as T
    return res.json() as Promise<T>

}
export function register(data: Json) {
    return request<{ message: string; user: Json }>('/api/account/register', {
        method: 'POST',
        body: JSON.stringify(data)

    })

}
export function login(data: JSON) {
    return request<{ message: string }>('/api/account/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function logout() {
    return request<{ message: string }>('/api/account/logout', {method: 'POST'})
}
export function me() {
    return request<{ authenticated: Boolean; name: string }>('api/account/me')

}
