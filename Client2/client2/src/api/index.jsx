// API service for handling all backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  // Generic method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Dashboard statistics
  async getDashboardStats() {
    return this.makeRequest('/dashboard/stats');
  }

  // Batches API calls
  async getBatches(limit = null) {
    const endpoint = limit ? `/batches?limit=${limit}` : '/batches';
    return this.makeRequest(endpoint);
  }

  async createBatch(batchData) {
    return this.makeRequest('/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  }

  async updateBatch(batchId, batchData) {
    return this.makeRequest(`/batches/${batchId}`, {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
  }

  async deleteBatch(batchId) {
    return this.makeRequest(`/batches/${batchId}`, {
      method: 'DELETE',
    });
  }

  // Users API calls
  async getUsers() {
    return this.makeRequest('/users');
  }

  async createUser(userData) {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Inventory API calls
  async getInventory() {
    return this.makeRequest('/inventory');
  }

  async updateStock(itemId, quantity) {
    return this.makeRequest(`/inventory/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  // Products API calls
  async getProducts() {
    return this.makeRequest('/products');
  }

  // Reports API calls
  async generateReport(reportType, params = {}) {
    return this.makeRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type: reportType, ...params }),
    });
  }

  // Notifications API calls
  async getNotifications() {
    return this.makeRequest('/notifications');
  }

  async markNotificationRead(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }
}

// Export a singleton instance
export default new ApiService();