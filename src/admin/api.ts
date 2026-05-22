/**
 * Client API centralisé pour le dashboard admin.
 * Gère l'authentification JWT et les appels CRUD.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function setToken(token: string) {
  localStorage.setItem('admin_token', token);
}

function removeToken() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ne pas mettre Content-Type pour FormData (upload)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/admin/login';
    throw new Error('Session expirée');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }

  return data;
}

// ============================================
// AUTH
// ============================================

export const auth = {
  async login(username: string, password: string) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.access_token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    removeToken();
  },

  getUser() {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!getToken();
  },

  async me() {
    return request('/api/auth/me');
  },
};

// ============================================
// CMS — Sections
// ============================================

export const cms = {
  // Hero
  async getHero() { return request('/api/cms/hero?all=true'); },
  async updateHero(data: any) { return request('/api/cms/hero', { method: 'PUT', body: JSON.stringify(data) }); },

  // About
  async getAbout() { return request('/api/cms/about?all=true'); },
  async updateAbout(data: any) { return request('/api/cms/about', { method: 'PUT', body: JSON.stringify(data) }); },

  // Settings
  async getSettings() { return request('/api/cms/settings'); },
  async updateSettings(data: any) { return request('/api/cms/settings', { method: 'PUT', body: JSON.stringify(data) }); },

  // Services
  async getServices() { return request('/api/cms/services?all=true'); },
  async createService(data: any) { return request('/api/cms/services', { method: 'POST', body: JSON.stringify(data) }); },
  async updateService(id: number, data: any) { return request(`/api/cms/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteService(id: number) { return request(`/api/cms/services/${id}`, { method: 'DELETE' }); },

  // Formulas
  async getFormulas() { return request('/api/cms/formulas?all=true'); },
  async createFormula(data: any) { return request('/api/cms/formulas', { method: 'POST', body: JSON.stringify(data) }); },
  async updateFormula(id: number, data: any) { return request(`/api/cms/formulas/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteFormula(id: number) { return request(`/api/cms/formulas/${id}`, { method: 'DELETE' }); },

  // Testimonials
  async getTestimonials() { return request('/api/cms/testimonials?all=true'); },
  async createTestimonial(data: any) { return request('/api/cms/testimonials', { method: 'POST', body: JSON.stringify(data) }); },
  async updateTestimonial(id: number, data: any) { return request(`/api/cms/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteTestimonial(id: number) { return request(`/api/cms/testimonials/${id}`, { method: 'DELETE' }); },

  // Gallery
  async getGallery() { return request('/api/cms/gallery?all=true'); },
  async createGalleryImage(data: any) { return request('/api/cms/gallery', { method: 'POST', body: JSON.stringify(data) }); },
  async updateGalleryImage(id: number, data: any) { return request(`/api/cms/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async deleteGalleryImage(id: number) { return request(`/api/cms/gallery/${id}`, { method: 'DELETE' }); },

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/cms/upload', { method: 'POST', body: formData });
  },
};

// ============================================
// CONTACT MESSAGES
// ============================================

export const messages = {
  async list(page = 1) { return request(`/api/contact/?page=${page}`); },
  async get(id: number) { return request(`/api/contact/${id}`); },
  async delete(id: number) { return request(`/api/contact/${id}`, { method: 'DELETE' }); },
};

// ============================================
// FINANCE
// ============================================

export const finance = {
  async dashboard() { return request('/api/finance/dashboard'); },
};
