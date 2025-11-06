type Json = Record<string, unknown>;async function request<T>(url: string, options: RequestInit = {}): Promise<T> {    const res = await fetch(url, {        ...options,        credentials: 'include', headers: {            'Content-Type': 'application/json',            ...(options.headers || {}),        },    });    if (!res.ok) throw new Error(`HTTP ${res.status}`);    return res.json();}export const api = {    register: (data: Json) =>        request('/api/account/register', {            method: 'POST',            body: JSON.stringify(                {                    email: data.email,
                    password: data.password,
                    displayName: data.displayName,
                    heightCm: data.heightCm,
                    weightKg: data.weightKg,
                }),        }),    login: (data: Json) =>        request('/api/account/login', {            method: 'POST',            body: JSON.stringify({
                Email: data.email,                Password: data.password,            }),        }),    logout: () => request('/api/account/logout', { method: 'POST' }),    me: () => request('/api/account/me'),};