import { API_URL } from './apiUrl';
import tokenManager from './tokenManager';

/**
 * Authenticated fetch wrapper that handles token management automatically
 */
export class AuthenticatedFetch {
  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Make an authenticated HTTP request
   * @param {string} endpoint - API endpoint (relative to baseURL)
   * @param {object} options - Fetch options (method, headers, body, etc.)
   * @param {boolean} requireAuth - Whether authentication is required (default: true)
   */
  async request(endpoint, options = {}, requireAuth = true) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authentication header if required
    if (requireAuth) {
      try {
        const accessToken = await tokenManager.getValidAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Authentication failed:', error);
        // Redirect to login or handle authentication error
        this._handleAuthError(error);
        throw error;
      }
    }


    const requestOptions = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, requestOptions);

      // Handle token expiration
      if (response.status === 401 && requireAuth) {
        try {
          // Try to refresh token and retry request
          const newAccessToken = await tokenManager.refreshToken();
          headers['Authorization'] = `Bearer ${newAccessToken}`;

          const retryResponse = await fetch(url, {
            ...requestOptions,
            headers,
          });

          if (!retryResponse.ok && retryResponse.status === 401) {
            // Still unauthorized after refresh, clear tokens and handle error
            tokenManager.clearTokens();
            this._handleAuthError(
              new Error('Authentication failed after token refresh')
            );
            throw new Error('Authentication failed');
          }

          return retryResponse;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          tokenManager.clearTokens();
          this._handleAuthError(refreshError);
          throw refreshError;
        }
      }

      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  /**
   * Convenience method for GET requests
   */
  async get(endpoint, options = {}, requireAuth = true) {
    return this.request(endpoint, { method: 'GET', ...options }, requireAuth);
  }

  /**
   * Convenience method for POST requests
   */
  async post(endpoint, data, options = {}, requireAuth = true) {
    return this.request(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      requireAuth
    );
  }

  /**
   * Convenience method for PUT requests
   */
  async put(endpoint, data, options = {}, requireAuth = true) {
    return this.request(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      requireAuth
    );
  }

  /**
   * Convenience method for DELETE requests
   */
  async delete(endpoint, options = {}, requireAuth = true) {
    return this.request(
      endpoint,
      { method: 'DELETE', ...options },
      requireAuth
    );
  }

  /**
   * Handle authentication errors
   */
  _handleAuthError(error) {
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('authError', { detail: error }));

    // You could also redirect to login page here
    // window.location.href = '/login';
  }

  /**
   * Get login data from localStorage
   */
  _getLoginData() {
    try {
      const loginData = localStorage.getItem('login');
      return loginData ? JSON.parse(loginData) : null;
    } catch (error) {
      console.error('Error getting login data:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const authFetch = new AuthenticatedFetch();

// Export convenience functions
export const get = (endpoint, options, requireAuth) =>
  authFetch.get(endpoint, options, requireAuth);
export const post = (endpoint, data, options, requireAuth) =>
  authFetch.post(endpoint, data, options, requireAuth);
export const put = (endpoint, data, options, requireAuth) =>
  authFetch.put(endpoint, data, options, requireAuth);
export const del = (endpoint, options, requireAuth) =>
  authFetch.delete(endpoint, options, requireAuth);
