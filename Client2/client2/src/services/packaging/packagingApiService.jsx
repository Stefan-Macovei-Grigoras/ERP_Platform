// // services/packaging/packagingApiService.jsx

// const API_BASE_URL ='http://localhost:5000';

// /**
//  * Packaging API Service
//  * Handles all packaging-related API calls
//  */
// const packagingApiService = {
  
//   /**
//    * Get authentication token from localStorage
//    */
//   getAuthToken() {
//     return localStorage.getItem('authToken') || 
//            sessionStorage.getItem('authToken') || 
//            null;
//   },

//   /**
//    * Get packaging queue (batches ready for packaging)
//    */
//   async getPackagingQueue() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/queue`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch packaging queue: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching packaging queue:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get packaging statistics
//    */
//   async getPackagingStats() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/stats`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch packaging stats: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching packaging stats:', error);
//       throw error;
//     }
//   },

//   /**
//    * Start packaging for a batch
//    */
//   async startPackaging(batchId, workerId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/start`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify({ batchId, workerId })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to start packaging: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error starting packaging:', error);
//       throw error;
//     }
//   },

//   /**
//    * Complete packaging for a batch
//    */
//   async completePackaging(batchId, packagingData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/complete`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify({ batchId, ...packagingData })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to complete packaging: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error completing packaging:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get packaging history
//    */
//   async getPackagingHistory(limit = 50) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/history?limit=${limit}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch packaging history: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching packaging history:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update packaging status
//    */
//   async updatePackagingStatus(batchId, status) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/${batchId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify({ status })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update packaging status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error updating packaging status:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get current user's packaging tasks
//    */
//   async getMyPackagingTasks(workerId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/my-tasks/${workerId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch my packaging tasks: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching my packaging tasks:', error);
//       throw error;
//     }
//   },

//   /**
//    * Pause packaging for a batch
//    */
//   async pausePackaging(batchId, reason = '') {
//     try {
//       const response = await fetch(`${API_BASE_URL}/packaging/pause`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify({ batchId, reason })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to pause packaging: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error pausing packaging:', error);
//       throw error;
//     }
//   }
// };

// export default packagingApiService;

// services/packaging/packagingApiService.jsx

const API_BASE_URL ='http://localhost:5000';

/**
 * Packaging API Service
 * Handles all packaging-related API calls
 */
const packagingApiService = {
  
  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('token') || null;
  },

  /**
   * Get packaging queue (batches ready for packaging)
   */
  async getPackagingQueue() {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/queue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch packaging queue: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching packaging queue:', error);
      throw error;
    }
  },

  /**
   * Get packaging statistics
   */
  async getPackagingStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch packaging stats: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching packaging stats:', error);
      throw error;
    }
  },

  /**
   * Start packaging for a batch
   */
  async startPackaging(batchId, workerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ batchId, workerId })
      });

      if (!response.ok) {
        throw new Error(`Failed to start packaging: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting packaging:', error);
      throw error;
    }
  },

  /**
   * Complete packaging for a batch
   */
  async completePackaging(batchId, packagingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ batchId, ...packagingData })
      });

      if (!response.ok) {
        throw new Error(`Failed to complete packaging: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing packaging:', error);
      throw error;
    }
  },

  /**
   * Get packaging history
   */
  async getPackagingHistory(limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/history?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch packaging history: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching packaging history:', error);
      throw error;
    }
  },

  /**
   * Update packaging status
   */
  async updatePackagingStatus(batchId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/${batchId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update packaging status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating packaging status:', error);
      throw error;
    }
  },

  /**
   * Get current user's packaging tasks
   */
  async getMyPackagingTasks(workerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/my-tasks/${workerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch my packaging tasks: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching my packaging tasks:', error);
      throw error;
    }
  },

  /**
   * Pause packaging for a batch
   */
  async pausePackaging(batchId, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/packaging/pause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ batchId, reason })
      });

      if (!response.ok) {
        throw new Error(`Failed to pause packaging: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error pausing packaging:', error);
      throw error;
    }
  }
};

export default packagingApiService;