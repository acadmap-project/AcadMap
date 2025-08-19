import { API_URL } from './apiUrl';

/**
 * Token Management Utility
 * Handles storage, refresh, and validation of JWT tokens
 */
class TokenManager {
  constructor() {
    this.refreshPromise = null;
  }

  /**
   * Get tokens from localStorage
   */
  getTokens() {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsed = JSON.parse(loginData);
        return {
          accessToken: parsed.accessToken,
          refreshTokenUUID: parsed.refreshTokenUUID,
        };
      }
    } catch (error) {
      console.error('Error getting tokens:', error);
    }
    return { accessToken: null, refreshTokenUUID: null };
  }

  /**
   * Update tokens in localStorage
   */
  updateTokens(accessToken, refreshTokenUUID) {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsed = JSON.parse(loginData);
        parsed.accessToken = accessToken;
        parsed.refreshTokenUUID = refreshTokenUUID;
        localStorage.setItem('login', JSON.stringify(parsed));

        // Broadcast change to sync across tabs
        window.dispatchEvent(new Event('loginStateChange'));
      }
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  }

  /**
   * Check if token is expired or close to expiring
   */
  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;

      // Consider token expired if it expires in the next 5 minutes (300 seconds)
      return decodedPayload.exp < currentTime + 300;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken() {
    // If there's already a refresh in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const { refreshTokenUUID } = this.getTokens();

    if (!refreshTokenUUID) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this._performRefresh(refreshTokenUUID);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  async _performRefresh(refreshTokenUUID) {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshTokenUUID }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Refresh token is invalid, user needs to login again
          this.clearTokens();
          throw new Error('Refresh token expired');
        }
        throw new Error('Token refresh failed');
      }

      const tokenData = await response.json();

      // Update stored tokens
      this.updateTokens(tokenData.accessToken, tokenData.refreshTokenUUID);

      return tokenData.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken() {
    const { accessToken } = this.getTokens();

    if (!accessToken) {
      throw new Error('No access token available');
    }

    if (this.isTokenExpired(accessToken)) {
      try {
        const newAccessToken = await this.refreshToken();
        return newAccessToken;
      } catch (error) {
        // If refresh fails, clear tokens and throw
        this.clearTokens();
        throw error;
      }
    }

    return accessToken;
  }

  /**
   * Clear all tokens
   */
  clearTokens() {
    try {
      const loginData = localStorage.getItem('login');
      if (loginData) {
        const parsed = JSON.parse(loginData);
        parsed.accessToken = null;
        parsed.refreshTokenUUID = null;
        parsed.isLoggedIn = false;
        localStorage.setItem('login', JSON.stringify(parsed));

        // Broadcast change to sync across tabs
        window.dispatchEvent(new Event('loginStateChange'));
      }
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
}

export default new TokenManager();
