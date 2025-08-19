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

//   // // Get all products
//   // async getProducts() {
//   //   try {
//   //     return await this.makeRequest('/product');
//   //   } catch (error) {
//   //     console.warn('Using mock data for products:', error.message);
//   //     return this.getMockProducts();
//   //   }
//   // }

//   // // Create new product
//   // async createProduct(productData) {
//   //   try {
//   //     return await this.makeRequest('/product', {
//   //       method: 'POST',
//   //       body: JSON.stringify(productData),
//   //     });
//   //   } catch (error) {
//   //     console.error('Failed to create product:', error);
//   //     throw error;
//   //   }
//   // }

//   // // Update product
//   // async updateProduct(productId, productData) {
//   //   try {
//   //     return await this.makeRequest(`/product/${productId}`, {
//   //       method: 'PUT',
//   //       body: JSON.stringify(productData),
//   //     });
//   //   } catch (error) {
//   //     console.error('Failed to update product:', error);
//   //     throw error;
//   //   }
//   // }

//   // // Delete product
//   // async deleteProduct(productId) {
//   //   try {
//   //     return await this.makeRequest(`/product/${productId}`, {
//   //       method: 'DELETE',
//   //     });
//   //   } catch (error) {
//   //     console.error('Failed to delete product:', error);
//   //     throw error;
//   //   }
//   // }

//   // =============
//   // INVENTORY API
//   // =============

//   // Get all inventory items
//   // async getInventory() {
//   //   try {
//   //     return await this.makeRequest('/ingredient');
//   //   } catch (error) {
//   //     console.warn('Using mock data for inventory:', error.message);
//   //     return this.getMockInventory();
//   //   }
//   // }

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

//   // // BATCHES API


//   // // Get all batches (admin view)
//   // async getAllBatches(filters = {}) {
//   //   try {
//   //     const queryParams = new URLSearchParams(filters).toString();
//   //     const endpoint = queryParams ? `/admin/batches?${queryParams}` : '/admin/batches';
//   //     return await this.makeRequest(endpoint);
//   //   } catch (error) {
//   //     console.warn('Using mock data for batches:', error.message);
//   //     return this.getMockBatches();
//   //   }
//   // }

//   // // Create new batch
//   // async createBatch(batchData) {
//   //   try {
//   //     return await this.makeRequest('/admin/batches', {
//   //       method: 'POST',
//   //       body: JSON.stringify(batchData),
//   //     });
//   //   } catch (error) {
//   //     console.error('Failed to create batch:', error);
//   //     throw error;
//   //   }
//   // }

//   // // Update batch
//   // async updateBatch(batchId, batchData) {
//   //   try {
//   //     return await this.makeRequest(`/admin/batches/${batchId}`, {
//   //       method: 'PUT',
//   //       body: JSON.stringify(batchData),
//   //     });
//   //   } catch (error) {
//   //     console.error('Failed to update batch:', error);
//   //     throw error;
//   //   }
//   // }

//   // // =============
//   // // DASHBOARD API
//   // // =============

//   // // Get dashboard statistics
//   // async getDashboardStats() {
//   //   try {
//   //     return await this.makeRequest('/admin/dashboard/stats');
//   //   } catch (error) {
//   //     console.warn('Using mock data for dashboard stats:', error.message);
//   //     return this.getMockDashboardStats();
//   //   }
//   // }

//   // =============
//   // MOCK DATA (for development)
//   // =============

//   getMockUsers() {
//     return [
//       { 
//         id: 1, 
//         name: 'Maria Popescu', 
//         email: 'maria.popescu@cheese.ro',
//         role: 'Factory Worker', 
//         status: 'Online', 
//         lastActive: '2 min ago',
//         phone: '+40 123 456 789',
//         joinDate: '2024-01-15',
//         avatar: 'M'
//       },
//       { 
//         id: 2, 
//         name: 'Ion Georgescu', 
//         email: 'ion.georgescu@cheese.ro',
//         role: 'Packaging Worker', 
//         status: 'Online', 
//         lastActive: '5 min ago',
//         phone: '+40 123 456 788',
//         joinDate: '2024-02-01',
//         avatar: 'I'
//       },
//       { 
//         id: 3, 
//         name: 'Ana Ionescu', 
//         email: 'ana.ionescu@cheese.ro',
//         role: 'Manager', 
//         status: 'Offline', 
//         lastActive: '1 hour ago',
//         phone: '+40 123 456 787',
//         joinDate: '2023-12-10',
//         avatar: 'A'
//       },
//       { 
//         id: 4, 
//         name: 'Mihai Vasile', 
//         email: 'mihai.vasile@cheese.ro',
//         role: 'Factory Worker', 
//         status: 'Offline', 
//         lastActive: '3 hours ago',
//         phone: '+40 123 456 786',
//         joinDate: '2024-01-20',
//         avatar: 'M'
//       }
//     ];
//   }

//   getMockProducts() {
//     return [
//       {
//         id: 1,
//         name: 'Brânză de vaci',
//         category: 'Fresh Cheese',
//         description: 'Traditional Romanian cow cheese',
//         productionTime: '4-6 hours',
//         ingredients: ['Cow milk', 'Rennet', 'Salt'],
//         status: 'Active',
//         batchesProduced: 45,
//         avgQuality: 4.5,
//         price: '25.00',
//         lastProduced: '2 days ago',
//         difficulty: 'Medium'
//       }
//     ];
//   }

//   getMockInventory() {
//     return [
//       {
//         id: 1,
//         name: 'Cow Milk',
//         category: 'Raw Materials',
//         currentStock: 45,
//         unit: 'Liters',
//         minThreshold: 50,
//         maxCapacity: 200,
//         pricePerUnit: 3.5,
//         supplier: 'Local Farm Co.',
//         lastRestocked: '2024-01-10',
//         expiryDate: '2024-01-15',
//         location: 'Cold Storage A',
//         status: 'Low Stock'
//       }
//     ];
//   }

//   getMockBatches() {
//     return [
//       { 
//         id: 'BT-001', 
//         product: 'Brânză de vaci', 
//         stage: 'Processing', 
//         worker: 'Maria Popescu', 
//         time: '2h 30m',
//         startTime: '08:00',
//         priority: 'High',
//         quality: 'Good'
//       }
//     ];
//   }

//   getMockDashboardStats() {
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
//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL ='http://localhost:5000';

class AdminApiService {
  // Generic method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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


// /**
//  * Update batch stage
//  */
// async updateBatchStage(id, stage) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/batch/${id}/stage`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${this.getAuthToken()}`
//       },
//       body: JSON.stringify({ stage })
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to update batch stage: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error updating batch stage:', error);
//     throw error;
//   }
// }

  // =============
  // USERS API
  // =============

  // Get all users
  async getUsers() {
    try {
      return await this.makeRequest('/user');
    } catch (error) {
      // Fallback to mock data for development
      console.warn('Using mock data for users:', error.message);
      return this.getMockUsers();
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      return await this.makeRequest(`/user/${userId}`);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      console.log('Creating user with data:', JSON.stringify(userData)); // Debug log 
      return await this.makeRequest('/user', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, userData) {
    try {
      console.log('Updating user with ID:', userId, 'and data:', JSON.stringify(userData)); // Debug log
      return await this.makeRequest(`/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  // Delete user
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

  // // Get all products
  // async getProducts() {
  //   try {
  //     return await this.makeRequest('/product');
  //   } catch (error) {
  //     console.warn('Using mock data for products:', error.message);
  //     return this.getMockProducts();
  //   }
  // }

  // // Create new product
  // async createProduct(productData) {
  //   try {
  //     return await this.makeRequest('/product', {
  //       method: 'POST',
  //       body: JSON.stringify(productData),
  //     });
  //   } catch (error) {
  //     console.error('Failed to create product:', error);
  //     throw error;
  //   }
  // }

  // // Update product
  // async updateProduct(productId, productData) {
  //   try {
  //     return await this.makeRequest(`/product/${productId}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(productData),
  //     });
  //   } catch (error) {
  //     console.error('Failed to update product:', error);
  //     throw error;
  //   }
  // }

  // // Delete product
  // async deleteProduct(productId) {
  //   try {
  //     return await this.makeRequest(`/product/${productId}`, {
  //       method: 'DELETE',
  //     });
  //   } catch (error) {
  //     console.error('Failed to delete product:', error);
  //     throw error;
  //   }
  // }

  // =============
  // INVENTORY API
  // =============

  // Get all inventory items
  // async getInventory() {
  //   try {
  //     return await this.makeRequest('/ingredient');
  //   } catch (error) {
  //     console.warn('Using mock data for inventory:', error.message);
  //     return this.getMockInventory();
  //   }
  // }

  // Add inventory item
  async addInventoryItem(itemData) {
    try {
      return await this.makeRequest('/ingredient', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      throw error;
    }
  }

  // Update inventory item
  async updateInventoryItem(itemId, itemData) {
    try {
      return await this.makeRequest(`/ingredient/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      });
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  }

  // // BATCHES API


  // // Get all batches (admin view)
  // async getAllBatches(filters = {}) {
  //   try {
  //     const queryParams = new URLSearchParams(filters).toString();
  //     const endpoint = queryParams ? `/admin/batches?${queryParams}` : '/admin/batches';
  //     return await this.makeRequest(endpoint);
  //   } catch (error) {
  //     console.warn('Using mock data for batches:', error.message);
  //     return this.getMockBatches();
  //   }
  // }

  // // Create new batch
  // async createBatch(batchData) {
  //   try {
  //     return await this.makeRequest('/admin/batches', {
  //       method: 'POST',
  //       body: JSON.stringify(batchData),
  //     });
  //   } catch (error) {
  //     console.error('Failed to create batch:', error);
  //     throw error;
  //   }
  // }

  // // Update batch
  // async updateBatch(batchId, batchData) {
  //   try {
  //     return await this.makeRequest(`/admin/batches/${batchId}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(batchData),
  //     });
  //   } catch (error) {
  //     console.error('Failed to update batch:', error);
  //     throw error;
  //   }
  // }

  // // =============
  // // DASHBOARD API
  // // =============

  // // Get dashboard statistics
  // async getDashboardStats() {
  //   try {
  //     return await this.makeRequest('/admin/dashboard/stats');
  //   } catch (error) {
  //     console.warn('Using mock data for dashboard stats:', error.message);
  //     return this.getMockDashboardStats();
  //   }
  // }

  // =============
  // MOCK DATA (for development)
  // =============

  getMockUsers() {
    return [
      { 
        id: 1, 
        name: 'Maria Popescu', 
        email: 'maria.popescu@cheese.ro',
        role: 'Factory Worker', 
        status: 'Online', 
        lastActive: '2 min ago',
        phone: '+40 123 456 789',
        joinDate: '2024-01-15',
        avatar: 'M'
      },
      { 
        id: 2, 
        name: 'Ion Georgescu', 
        email: 'ion.georgescu@cheese.ro',
        role: 'Packaging Worker', 
        status: 'Online', 
        lastActive: '5 min ago',
        phone: '+40 123 456 788',
        joinDate: '2024-02-01',
        avatar: 'I'
      },
      { 
        id: 3, 
        name: 'Ana Ionescu', 
        email: 'ana.ionescu@cheese.ro',
        role: 'Manager', 
        status: 'Offline', 
        lastActive: '1 hour ago',
        phone: '+40 123 456 787',
        joinDate: '2023-12-10',
        avatar: 'A'
      },
      { 
        id: 4, 
        name: 'Mihai Vasile', 
        email: 'mihai.vasile@cheese.ro',
        role: 'Factory Worker', 
        status: 'Offline', 
        lastActive: '3 hours ago',
        phone: '+40 123 456 786',
        joinDate: '2024-01-20',
        avatar: 'M'
      }
    ];
  }

  getMockProducts() {
    return [
      {
        id: 1,
        name: 'Brânză de vaci',
        category: 'Fresh Cheese',
        description: 'Traditional Romanian cow cheese',
        productionTime: '4-6 hours',
        ingredients: ['Cow milk', 'Rennet', 'Salt'],
        status: 'Active',
        batchesProduced: 45,
        avgQuality: 4.5,
        price: '25.00',
        lastProduced: '2 days ago',
        difficulty: 'Medium'
      }
    ];
  }

  getMockInventory() {
    return [
      {
        id: 1,
        name: 'Cow Milk',
        category: 'Raw Materials',
        currentStock: 45,
        unit: 'Liters',
        minThreshold: 50,
        maxCapacity: 200,
        pricePerUnit: 3.5,
        supplier: 'Local Farm Co.',
        lastRestocked: '2024-01-10',
        expiryDate: '2024-01-15',
        location: 'Cold Storage A',
        status: 'Low Stock'
      }
    ];
  }

  getMockBatches() {
    return [
      { 
        id: 'BT-001', 
        product: 'Brânză de vaci', 
        stage: 'Processing', 
        worker: 'Maria Popescu', 
        time: '2h 30m',
        startTime: '08:00',
        priority: 'High',
        quality: 'Good'
      }
    ];
  }

  getMockDashboardStats() {
    return [
      { title: 'Total Users', value: '8', color: '#1976d2', change: '2 online now' },
      { title: 'Active Batches', value: '12', color: '#2e7d32', change: '+2 from yesterday' },
      { title: 'Products', value: '5', color: '#9c27b0', change: 'All in production' },
      { title: 'Low Stock Items', value: '3', color: '#ed6c02', change: 'Requires attention' }
    ];
  }
   // ============================================================================
  // INVENTORY CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all inventory items
   * @returns {Promise<Array>} Array of inventory items
   */
  async getInventory() {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredient`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }

  /**
   * Get a single inventory item by ID
   * @param {number|string} id - Inventory item ID
   * @returns {Promise<Object>} Inventory item data
   */
  async getInventoryItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredient/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory item: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  }

  
  // Create a new inventory item

  async createInventoryItem(itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create inventory item: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }

  

  /**
   * Delete an inventory item
   * @param {number|string} id - Inventory item ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteInventoryItem(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ingredient/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete inventory item: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }


  // ============================================================================
  // UTILITY METHOD (if not already implemented)
  // ============================================================================

  /**
   * Get authentication token from localStorage or wherever you store it
   * @returns {string|null} Authentication token
   */
  getAuthToken() {
    return localStorage.getItem('token') || null;
  }

   async getProducts() {
    try {
      const response = await fetch('http://localhost:5000/product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData) {
    try {
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`http://localhost:5000/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await fetch(`http://localhost:5000/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
  /**
   * Get all batches
   */
  async getBatches() {
    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch batches: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }

  /**
   * Create new batch
   */
  async createBatch(batchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create batch: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  }

  /**
   * Update batch
   */
  async updateBatchPut(id, batchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update batch: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  }

  /**
   * Delete batch
   */
  async deleteBatch(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete batch: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  }

  
  /**
   * Update batch status
   */
  async updateBatchStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/batch/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update batch status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating batch status:', error);
      throw error;
    }
  }
  async updateBatch(id, batchData) {
    try {
      console.log('Updating batch:', id, 'with data:', batchData); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/batch/${id}`, {
        method: 'PATCH', // Uppercase
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(batchData) // batchData should be an object like { stage: 'done' }
      });
      console.log(JSON.stringify(batchData))

      if (!response.ok) {
        throw new Error(`Failed to update batch: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  }

  // ====================
// RECIPE API
// ====================

// Get recipe by productId
async getRecipeByProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/recipe/product/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recipe for product ${productId}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe by product:', error);
    throw error;
  }
}

// Update recipe (replace steps JSON)
async updateRecipe(id, recipeData) {
  try {
    console.log('Updating recipe:', id, 'with data:', recipeData);

    const response = await fetch(`${API_BASE_URL}/recipe/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(recipeData)
    });

    console.log(JSON.stringify(recipeData));

    if (!response.ok) {
      throw new Error(`Failed to update recipe: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}
  
}

// Export a singleton instance
export default new AdminApiService();