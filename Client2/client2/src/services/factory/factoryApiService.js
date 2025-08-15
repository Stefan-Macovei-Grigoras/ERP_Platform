// // services/factory/factoryApiService.js
// const API_BASE_URL ='http://localhost:5000';

// class FactoryApiService {
//   // Generic method for making API requests
//   async makeRequest(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error(`API request failed: ${endpoint}`, error);
//       throw error;
//     }
//   }

//   // Get available products for production (recipes with products)
//   async getAvailableProducts() {
//     try {
//       // This would typically fetch from a "due production" endpoint
//       // For now, we'll fetch all recipes as available products
//       const recipes = await this.makeRequest('/recipe');
      
//       // Filter or transform as needed for factory worker view
//       return recipes.filter(recipe => 
//         recipe.Product && // Has associated product
//         recipe.steps && // Has production steps
//         recipe.steps.steps && // Has steps array
//         recipe.steps.steps.length > 0 // Has actual steps
//       );
//     } catch (error) {
//       console.error('Failed to fetch available products:', error);
//       throw error;
//     }
//   }

//   // Start production batch
//   async startProductionBatch(productionData) {
//     try {
//       return await this.makeRequest('/batch', {
//         method: 'POST',
//         body: JSON.stringify({
//           productId: productionData.productId,
//           recipeId: productionData.recipeId,
//           stage: 'Production',
//           startedAt: new Date().toISOString(),
//           expectedYield: productionData.yield
//         }),
//       });
//     } catch (error) {
//       console.error('Failed to start production batch:', error);
//       throw error;
//     }
//   }

//   // Update batch progress
//   async updateBatchProgress(batchId, stepData) {
//     try {
//       return await this.makeRequest(`/batch/${batchId}/progress`, {
//         method: 'PATCH',
//         body: JSON.stringify(stepData),
//       });
//     } catch (error) {
//       console.error('Failed to update batch progress:', error);
//       throw error;
//     }
//   }

//   // Complete production batch
//   async completeProductionBatch(batchId, completionData) {
//     try {
//       return await this.makeRequest(`/batch/${batchId}/complete`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           status: 'Completed',
//           stage: 'Quality Check',
//           completedAt: completionData.completedAt,
//           actualYield: completionData.yield,
//           actualDuration: completionData.totalDuration,
//           completedSteps: completionData.completedSteps,
//           notes: completionData.notes || ''
//         }),
//       });
//     } catch (error) {
//       console.error('Failed to complete production batch:', error);
//       throw error;
//     }
//   }

//   // Get worker's current batches
//   async getWorkerBatches(workerId) {
//     try {
//       return await this.makeRequest(`/batches/worker/${workerId}`);
//     } catch (error) {
//       console.error('Failed to fetch worker batches:', error);
//       throw error;
//     }
//   }

//   // Get production statistics for worker
//   async getWorkerStats(workerId) {
//     try {
//       return await this.makeRequest(`/batches/worker/${workerId}/stats`);
//     } catch (error) {
//       console.error('Failed to fetch worker stats:', error);
//       throw error;
//     }
//   }
// }

// // Export a singleton instance
// export default new FactoryApiService();

// services/factory/factoryApiService.js
const API_BASE_URL = 'http://localhost:5000';

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

  // Get available batches for production (batches with 'due' stage)
  async getAvailableBatches() {
    try {
      // Get all batches and filter for 'due' stage
      const batches = await this.makeRequest('/batch');
      console.log('All batches from API:', batches);
      
      // Filter for due batches that have Product with Recipe
      const availableBatches = batches.filter(batch => {
        const isValid = batch.stage === 'due' &&
          batch.Product && 
          batch.Product.Recipe && 
          batch.Product.Recipe.steps &&
          batch.Product.Recipe.steps.steps &&
          batch.Product.Recipe.steps.steps.length > 0;
        
        console.log(`Batch ${batch.id} validation:`, {
          stage: batch.stage,
          hasProduct: !!batch.Product,
          hasRecipe: !!batch.Product?.Recipe,
          hasSteps: !!batch.Product?.Recipe?.steps,
          hasStepsArray: !!batch.Product?.Recipe?.steps?.steps,
          stepsLength: batch.Product?.Recipe?.steps?.steps?.length || 0,
          isValid
        });
        
        return isValid;
      });

      console.log('Filtered available batches:', availableBatches);
      return availableBatches;
    } catch (error) {
      console.error('Failed to fetch available batches:', error);
      throw error;
    }
  }

  // Start production - update batch stage to 'start-processing'
  async startProduction(batchId) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'start-processing',
        }),
      });
    } catch (error) {
      console.error('Failed to start production:', error);
      throw error;
    }
  }

  // Update batch when processing is complete
  async finishProcessing(batchId, completionData) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'end-processing',
          // Store production data in notes as JSON
          notes: JSON.stringify({
            completedSteps: completionData.completedSteps,
            actualDuration: completionData.totalDuration,
            actualYield: completionData.yield,
            productionNotes: completionData.notes || 'Production completed successfully'
          })
        }),
      });
    } catch (error) {
      console.error('Failed to finish processing:', error);
      throw error;
    }
  }

  // Update batch stage to 'packaging'
  async startPackaging(batchId) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'packaging',
        }),
      });
    } catch (error) {
      console.error('Failed to start packaging:', error);
      throw error;
    }
  }

  // Complete entire batch - update stage to 'done'
  async completeBatch(batchId, finalData = {}) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'done',
          notes: finalData.notes || 'Batch completed successfully'
        }),
      });
    } catch (error) {
      console.error('Failed to complete batch:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new FactoryApiService();