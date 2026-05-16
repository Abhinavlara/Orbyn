const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('orbyn_token');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  // --- AUTH OTP ---
  async sendOTP(identifier: string) {
    const res = await fetch(`${API_URL}/auth/send-otp`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ identifier }) });
    return res.json();
  }

  async verifyOTP(data: { identifier: string; otp: string; name?: string; email?: string }) {
    const res = await fetch(`${API_URL}/auth/verify-otp`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  // Set/Clear Token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') localStorage.setItem('orbyn_token', token);
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') localStorage.removeItem('orbyn_token');
  }

  // --- PAYMENTS ---
  async createRazorpayOrder(bookingId: string) {
    const res = await fetch(`${API_URL}/payments/create-order`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ bookingId }) });
    return res.json();
  }

  async verifyRazorpayPayment(data: any) {
    const res = await fetch(`${API_URL}/payments/verify`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  // --- TRAINS ---
  async searchTrains(params: any) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_URL}/trains/search${query}`);
    return res.json();
  }

  async getStations(q: string) {
    const res = await fetch(`${API_URL}/trains/stations?q=${encodeURIComponent(q)}`);
    return res.json();
  }

  // Auth
  async signup(data: { name: string; email: string; password: string; role?: string }) {
    const res = await fetch(`${API_URL}/auth/signup`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    const json = await res.json();
    if (json.token) this.setToken(json.token);
    return json;
  }

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    const json = await res.json();
    if (json.token) this.setToken(json.token);
    return json;
  }

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, { method: 'POST', headers: this.getHeaders() });
    this.clearToken();
    return res.json();
  }

  async getProfile() {
    const res = await fetch(`${API_URL}/auth/profile`, { headers: this.getHeaders() });
    return res.json();
  }

  async updateProfile(data: Record<string, string>) {
    const res = await fetch(`${API_URL}/auth/profile`, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  async toggleWishlist(propertyId: string) {
    const res = await fetch(`${API_URL}/auth/wishlist/${propertyId}`, { method: 'PUT', headers: this.getHeaders() });
    return res.json();
  }

  // Properties
  async getProperties(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_URL}/properties${query}`);
    return res.json();
  }

  async getProperty(id: string) {
    const res = await fetch(`${API_URL}/properties/${id}`);
    return res.json();
  }

  async createProperty(data: Record<string, unknown> | FormData) {
    const isFormData = data instanceof FormData;
    const headers = this.getHeaders();
    if (isFormData) delete headers['Content-Type'];
    const res = await fetch(`${API_URL}/properties`, { method: 'POST', headers, body: isFormData ? data : JSON.stringify(data) });
    return res.json();
  }

  async updateProperty(id: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/properties/${id}`, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  async deleteProperty(id: string) {
    const res = await fetch(`${API_URL}/properties/${id}`, { method: 'DELETE', headers: this.getHeaders() });
    return res.json();
  }

  // Bookings
  async createBooking(data: { propertyId: string; checkIn: string; checkOut: string; guests?: { adults: number; children: number } }) {
    const res = await fetch(`${API_URL}/bookings`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  async getBookings() {
    const res = await fetch(`${API_URL}/bookings`, { headers: this.getHeaders() });
    return res.json();
  }

  async getUserBookings() {
    const res = await fetch(`${API_URL}/bookings/my-bookings`, { headers: this.getHeaders() });
    return res.json();
  }

  async getHostBookings() {
    const res = await fetch(`${API_URL}/bookings/host`, { headers: this.getHeaders() });
    return res.json();
  }

  async createCheckoutSession(bookingId: string) {
    const res = await fetch(`${API_URL}/payments/create-checkout-session`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ bookingId }) });
    return res.json();
  }

  // Reviews
  async createReview(data: { propertyId: string; rating: number; comment: string }) {
    const res = await fetch(`${API_URL}/reviews`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) });
    return res.json();
  }

  async getPropertyReviews(propertyId: string) {
    const res = await fetch(`${API_URL}/reviews/${propertyId}`);
    return res.json();
  }

  async getAllReviews() {
    const res = await fetch(`${API_URL}/reviews`);
    return res.json();
  }

  // Flights
  async searchFlights(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_URL}/flights${query}`);
    return res.json();
  }

  async getFlight(id: string) {
    const res = await fetch(`${API_URL}/flights/${id}`);
    return res.json();
  }

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_URL}/notifications`, { headers: this.getHeaders() });
    return res.json();
  }

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, { method: 'PUT', headers: this.getHeaders() });
    return res.json();
  }

  async markAllNotificationsRead() {
    const res = await fetch(`${API_URL}/notifications/read-all`, { method: 'PUT', headers: this.getHeaders() });
    return res.json();
  }

  // Admin
  async getAllUsers() {
    const res = await fetch(`${API_URL}/admin/users`, { headers: this.getHeaders() });
    return res.json();
  }

  async deleteUser(id: string) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: this.getHeaders() });
    return res.json();
  }

  async getAnalytics() {
    const res = await fetch(`${API_URL}/admin/analytics`, { headers: this.getHeaders() });
    return res.json();
  }

  // Reports
  async getReports() {
    const res = await fetch(`${API_URL}/reports`, { headers: this.getHeaders() });
    return res.json();
  }

  async updateReportStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/reports/${id}`, { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify({ status }) });
    return res.json();
  }
}

export const api = new ApiService();
export default api;
