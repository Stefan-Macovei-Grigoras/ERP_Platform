// services/factory/factoryApiService.js
const API_BASE_URL ='http://localhost:5000';

class FactoryApiService {
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

  // Get available products for production (recipes with products)
  async getAvailableProducts() {
    try {
      // This would typically fetch from a "due production" endpoint
      // For now, we'll fetch all recipes as available products
      const recipes = await this.makeRequest('/recipe');
      
      // Filter or transform as needed for factory worker view
      return recipes.filter(recipe => 
        recipe.Product && // Has associated product
        recipe.steps && // Has production steps
        recipe.steps.steps && // Has steps array
        recipe.steps.steps.length > 0 // Has actual steps
      );
    } catch (error) {
      console.error('Failed to fetch available products:', error);
      throw error;
    }
  }

  // Start production batch
  async startProductionBatch(productionData) {
    try {
      return await this.makeRequest('/batch', {
        method: 'POST',
        body: JSON.stringify({
          productId: productionData.productId,
          recipeId: productionData.recipeId,
          status: 'In Progress',
          stage: 'Production',
          assignedWorker: 'Current Worker', // You'd get this from auth context
          startedAt: new Date().toISOString(),
          expectedYield: productionData.yield
        }),
      });
    } catch (error) {
      console.error('Failed to start production batch:', error);
      throw error;
    }
  }

  // Update batch progress
  async updateBatchProgress(batchId, stepData) {
    try {
      return await this.makeRequest(`/batch/${batchId}/progress`, {
        method: 'PATCH',
        body: JSON.stringify(stepData),
      });
    } catch (error) {
      console.error('Failed to update batch progress:', error);
      throw error;
    }
  }

  // Complete production batch
  async completeProductionBatch(batchId, completionData) {
    try {
      return await this.makeRequest(`/batch/${batchId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'Completed',
          stage: 'Quality Check',
          completedAt: completionData.completedAt,
          actualYield: completionData.yield,
          actualDuration: completionData.totalDuration,
          completedSteps: completionData.completedSteps,
          notes: completionData.notes || ''
        }),
      });
    } catch (error) {
      console.error('Failed to complete production batch:', error);
      throw error;
    }
  }

  // Get worker's current batches
  async getWorkerBatches(workerId) {
    try {
      return await this.makeRequest(`/batches/worker/${workerId}`);
    } catch (error) {
      console.error('Failed to fetch worker batches:', error);
      throw error;
    }
  }

  // Get production statistics for worker
  async getWorkerStats(workerId) {
    try {
      return await this.makeRequest(`/batches/worker/${workerId}/stats`);
    } catch (error) {
      console.error('Failed to fetch worker stats:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new FactoryApiService();