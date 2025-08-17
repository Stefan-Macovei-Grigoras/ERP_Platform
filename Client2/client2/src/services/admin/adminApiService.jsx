// // services/admin/adminApiService.js
// //const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// const API_BASE_URL ='http://localhost:5000';

// class AdminApiService {
//   // Generic method for making API requests
//   async makeRequest(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error(`Admin API request failed: ${endpoint}`, error);
//       throw error;
//     }
//   }


// // /**
// //  * Update batch stage
// //  */
// // async updateBatchStage(id, stage) {
// //   try {
// //     const response = await fetch(`${API_BASE_URL}/batch/${id}/stage`, {
// //       method: 'PATCH',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${this.getAuthToken()}`
// //       },
// //       body: JSON.stringify({ stage })
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to update batch stage: ${response.status}`);
// //     }

// //     return await response.json();
// //   } catch (error) {
// //     console.error('Error updating batch stage:', error);
// //     throw error;
// //   }
// // }

//   // =============
//   // USERS API
//   // =============

//   // Get all users
//   async getUsers() {
//     try {
//       return await this.makeRequest('/user');
//     } catch (error) {
//       // Fallback to mock data for development
//       console.warn('Using mock data for users:', error.message);
//       return this.getMockUsers();
//     }
//   }

//   // Get user by ID
//   async getUserById(userId) {
//     try {
//       return await this.makeRequest(`/user/${userId}`);
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       throw error;
//     }
//   }

//   // Create new user
//   async createUser(userData) {
//     try {
//       console.log('Creating user with data:', JSON.stringify(userData)); // Debug log 
//       return await this.makeRequest('/user', {
//         method: 'POST',
//         body: JSON.stringify(userData),
//       });
//     } catch (error) {
//       console.error('Failed to create user:', error);
//       throw error;
//     }
//   }

//   // Update user
//   async updateUser(userId, userData) {
//     try {
//       console.log('Updating user with ID:', userId, 'and data:', JSON.stringify(userData)); // Debug log
//       return await this.makeRequest(`/user/${userId}`, {
//         method: 'PUT',
//         body: JSON.stringify(userData),
//       });
//     } catch (error) {
//       console.error('Failed to update user:', error);
//       throw error;
//     }
//   }

//   // Delete user
//   async deleteUser(userId) {
//     try {
//       return await this.makeRequest(`/user/${userId}`, {
//         method: 'DELETE',
//       });
//     } catch (error) {
//       console.error('Failed to delete user:', error);
//       throw error;
//     }
//   }

//   // =============
//   // PRODUCTS API
//   // =============

//   // Add inventory item
//   async addInventoryItem(itemData) {
//     try {
//       return await this.makeRequest('/ingredient', {
//         method: 'POST',
//         body: JSON.stringify(itemData),
//       });
//     } catch (error) {
//       console.error('Failed to add inventory item:', error);
//       throw error;
//     }
//   }

//   // Update inventory item
//   async updateInventoryItem(itemId, itemData) {
//     try {
//       return await this.makeRequest(`/ingredient/${itemId}`, {
//         method: 'PUT',
//         body: JSON.stringify(itemData),
//       });
//     } catch (error) {
//       console.error('Failed to update inventory item:', error);
//       throw error;
//     }
//   }
// shboardStats() {
//     return [
//       { title: 'Total Users', value: '8', color: '#1976d2', change: '2 online now' },
//       { title: 'Active Batches', value: '12', color: '#2e7d32', change: '+2 from yesterday' },
//       { title: 'Products', value: '5', color: '#9c27b0', change: 'All in production' },
//       { title: 'Low Stock Items', value: '3', color: '#ed6c02', change: 'Requires attention' }
//     ];
//   }
//    // ============================================================================
//   // INVENTORY CRUD OPERATIONS
//   // ============================================================================

//   /**
//    * Get all inventory items
//    * @returns {Promise<Array>} Array of inventory items
//    */
//   async getInventory() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ingredient`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           //'Authorization': `Bearer ${this.getAuthToken()}` // Assuming you have auth
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching inventory:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get a single inventory item by ID
//    * @param {number|string} id - Inventory item ID
//    * @returns {Promise<Object>} Inventory item data
//    */
//   async getInventoryItem(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ingredient/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch inventory item: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching inventory item:', error);
//       throw error;
//     }
//   }

  
//   // Create a new inventory item

//   async createInventoryItem(itemData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ingredient`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify(itemData)
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create inventory item: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating inventory item:', error);
//       throw error;
//     }
//   }

  

//   /**
//    * Delete an inventory item
//    * @param {number|string} id - Inventory item ID
//    * @returns {Promise<boolean>} Success status
//    */
//   async deleteInventoryItem(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/ingredient/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete inventory item: ${response.status} ${response.statusText}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error deleting inventory item:', error);
//       throw error;
//     }
//   }


//   // ============================================================================
//   // UTILITY METHOD (if not already implemented)
//   // ============================================================================

//   /**
//    * Get authentication token from localStorage or wherever you store it
//    * @returns {string|null} Authentication token
//    */
//   getAuthToken() {
//     // Adjust this based on how you store authentication tokens
//     return localStorage.getItem('authToken') || 
//            sessionStorage.getItem('authToken') || 
//            null;
//   }

//    async getProducts() {
//     try {
//       const response = await fetch('http://localhost:5000/product', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to fetch products: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//     }
//   }

//   // Create new product
//   async createProduct(productData) {
//     try {
//       const response = await fetch('http://localhost:5000/product', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData)
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to create product: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating product:', error);
//       throw error;
//     }
//   }

//   // Update product
//   async updateProduct(id, productData) {
//     try {
//       const response = await fetch(`http://localhost:5000/product/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData)
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to update product: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating product:', error);
//       throw error;
//     }
//   }

//   // Delete product
//   async deleteProduct(id) {
//     try {
//       const response = await fetch(`http://localhost:5000/product/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to delete product: ${response.status}`);
//       }
//       return true;
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       throw error;
//     }
//   }
//   /**
//    * Get all batches
//    */
//   async getBatches() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/batch`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch batches: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching batches:', error);
//       throw error;
//     }
//   }

//   /**
//    * Create new batch
//    */
//   async createBatch(batchData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/batch`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify(batchData)
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create batch: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error creating batch:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update batch
//    */
//   async updateBatchPut(id, batchData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify(batchData)
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update batch: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error updating batch:', error);
//       throw error;
//     }
//   }

//   /**
//    * Delete batch
//    */
//   async deleteBatch(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete batch: ${response.status}`);
//       }

//       return true;
//     } catch (error) {
//       console.error('Error deleting batch:', error);
//       throw error;
//     }
//   }

  
//   /**
//    * Update batch status
//    */
//   async updateBatchStatus(id, status) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/batch/${id}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify({ status })
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update batch status: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error updating batch status:', error);
//       throw error;
//     }
//   }
//   async updateBatch(id, batchData) {
//     try {
//       console.log('Updating batch:', id, 'with data:', batchData); // Debug log
      
//       const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
//         method: 'PATCH', // Uppercase
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${this.getAuthToken()}`
//         },
//         body: JSON.stringify(batchData) // batchData should be an object like { stage: 'done' }
//       });
//       console.log(JSON.stringify(batchData))

//       if (!response.ok) {
//         throw new Error(`Failed to update batch: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error updating batch:', error);
//       throw error;
//     }
//   }
  
// }

// // Export a singleton instance
// export default new AdminApiService();

// services/admin/adminApiService.js
const API_BASE_URL = 'http://localhost:5000';

class AdminApiService {
  // Generic method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Admin API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem('token'); // Match auth context storage key
  }

  // =============
  // USERS API
  // =============

  async getUsers() {
    try {
      return await this.makeRequest('/user');
    } catch (error) {
      console.warn('Using mock data for users:', error.message);
      //return this.getMockUsers();
    }
  }

  async getUserById(userId) {
    try {
      return await this.makeRequest(`/user/${userId}`);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      console.log('Creating user with data:', JSON.stringify(userData));
      return await this.makeRequest('/user', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      console.log('Updating user with ID:', userId, 'and data:', JSON.stringify(userData));
      return await this.makeRequest(`/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      return await this.makeRequest(`/user/${userId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  // =============
  // PRODUCTS API
  // =============

  async getProducts() {
    try {
      return await this.makeRequest('/product');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      return await this.makeRequest('/product', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      return await this.makeRequest(`/product/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await this.makeRequest(`/product/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // =============
  // INVENTORY API
  // =============

  async getInventory() {
    try {
      return await this.makeRequest('/ingredient');
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  async getInventoryItem(id) {
    try {
      return await this.makeRequest(`/ingredient/${id}`);
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  async createInventoryItem(itemData) {
    try {
      return await this.makeRequest('/ingredient', {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  async addInventoryItem(itemData) {
    return this.createInventoryItem(itemData);
  }

  async updateInventoryItem(itemId, itemData) {
    try {
      return await this.makeRequest(`/ingredient/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
      });
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  }

  async deleteInventoryItem(id) {
    try {
      await this.makeRequest(`/ingredient/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  // =============
  // BATCHES API
  // =============

  async getBatches() {
    try {
      return await this.makeRequest('/batch');
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }

  async createBatch(batchData) {
    try {
      return await this.makeRequest('/batch', {
        method: 'POST',
        body: JSON.stringify(batchData)
      });
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  }

  async updateBatch(id, batchData) {
    try {
      console.log('Updating batch:', id, 'with data:', batchData);
      return await this.makeRequest(`/batch/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(batchData)
      });
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  }

  async updateBatchPut(id, batchData) {
    try {
      return await this.makeRequest(`/batch/${id}`, {
        method: 'PUT',
        body: JSON.stringify(batchData)
      });
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  }

  async deleteBatch(id) {
    try {
      await this.makeRequest(`/batch/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  }

  async updateBatchStatus(id, status) {
    try {
      return await this.makeRequest(`/batch/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Error updating batch status:', error);
      throw error;
    }
  }
  
}

// Export a singleton instance
export default new AdminApiService();