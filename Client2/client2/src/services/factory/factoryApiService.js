
// // // services/factory/factoryApiService.js
// // const API_BASE_URL = 'http://localhost:5000';

// // class FactoryApiService {
// //   // Generic method for making API requests
// //   async makeRequest(endpoint, options = {}) {
// //     const url = `${API_BASE_URL}${endpoint}`;
// //     const config = {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         ...options.headers,
// //       },
// //       ...options,
// //     };

// //     try {
// //       const response = await fetch(url, config);
      
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error(`API request failed: ${endpoint}`, error);
// //       throw error;
// //     }
// //   }

// //   // Get available batches for production (batches with 'due' stage)
// //   async getAvailableBatches() {
// //     try {
// //       // Get all batches and filter for 'due' stage
// //       const batches = await this.makeRequest('/batch');
// //       console.log('All batches from API:', batches);
      
// //       // Filter for due batches that have Product with Recipe
// //       const availableBatches = batches.filter(batch => {
// //         const isValid = (batch.stage === 'due' || batch.stage === 'start-processing') &&
// //           batch.Product && 
// //           batch.Product.Recipe && 
// //           batch.Product.Recipe.steps &&
// //           batch.Product.Recipe.steps.steps &&
// //           batch.Product.Recipe.steps.steps.length > 0;
        
// //         console.log(`Batch ${batch.id} validation:`, {
// //           stage: batch.stage,
// //           hasProduct: !!batch.Product,
// //           hasRecipe: !!batch.Product?.Recipe,
// //           hasSteps: !!batch.Product?.Recipe?.steps,
// //           hasStepsArray: !!batch.Product?.Recipe?.steps?.steps,
// //           stepsLength: batch.Product?.Recipe?.steps?.steps?.length || 0,
// //           isValid
// //         });
        
// //         return isValid;
// //       });

// //       console.log('Filtered available batches:', availableBatches);
// //       return availableBatches;
// //     } catch (error) {
// //       console.error('Failed to fetch available batches:', error);
// //       throw error;
// //     }
// //   }

// //   // Start production - update batch stage to 'start-processing'
// //   async startProduction(batchId) {
// //     try {
// //       return await this.makeRequest(`/batch/${batchId}`, {
// //         method: 'PATCH',
// //         body: JSON.stringify({
// //           stage: 'start-processing',
// //         }),
// //       });
// //     } catch (error) {
// //       console.error('Failed to start production:', error);
// //       throw error;
// //     }
// //   }

// //   // Update batch when processing is complete
// //   async finishProcessing(batchId, completionData) {
// //     try {
// //       return await this.makeRequest(`/batch/${batchId}`, {
// //         method: 'PATCH',
// //         body: JSON.stringify({
// //           stage: 'end-processing',
// //           // Store production data in notes as JSON
// //           notes: JSON.stringify({
// //             completedSteps: completionData.completedSteps,
// //             actualDuration: completionData.totalDuration,
// //             actualYield: completionData.yield,
// //             productionNotes: completionData.notes || 'Production completed successfully'
// //           })
// //         }),
// //       });
// //     } catch (error) {
// //       console.error('Failed to finish processing:', error);
// //       throw error;
// //     }
// //   }

// //   // Update batch stage to 'packaging'
// //   async startPackaging(batchId) {
// //     try {
// //       return await this.makeRequest(`/batch/${batchId}`, {
// //         method: 'PATCH',
// //         body: JSON.stringify({
// //           stage: 'packaging',
// //         }),
// //       });
// //     } catch (error) {
// //       console.error('Failed to start packaging:', error);
// //       throw error;
// //     }
// //   }

// //   // Complete entire batch - update stage to 'done'
// //   async completeBatch(batchId, finalData = {}) {
// //     try {
// //       return await this.makeRequest(`/batch/${batchId}`, {
// //         method: 'PATCH',
// //         body: JSON.stringify({
// //           stage: 'done',
// //           notes: finalData.notes || 'Batch completed successfully'
// //         }),
// //       });
// //     } catch (error) {
// //       console.error('Failed to complete batch:', error);
// //       throw error;
// //     }
// //   }
// // }

// // // Export a singleton instance
// // export default new FactoryApiService();

// // services/factory/factoryApiService.js

// const API_BASE_URL ='http://localhost:5000';

// class FactoryApiService {
//   constructor() {
//     this.requestTimeout = 10000;
//     this.maxRetries = 3;
//   }

//   async makeRequest(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
    
//     for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
//       try {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
        
//         const config = {
//           headers: {
//             'Content-Type': 'application/json',
//             ...options.headers,
//           },
//           signal: controller.signal,
//           ...options,
//         };

//         const response = await fetch(url, config);
//         clearTimeout(timeoutId);
        
//         if (!response.ok) {
//           const errorBody = await response.text();
//           throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
//         }
        
//         return await response.json();
//       } catch (error) {
//         console.error(`API request attempt ${attempt} failed: ${endpoint}`, error);
        
//         if (attempt === this.maxRetries || error.name === 'AbortError') {
//           throw new Error(`Request failed after ${this.maxRetries} attempts: ${error.message}`);
//         }
        
//         await this.delay(Math.pow(2, attempt) * 1000);
//       }
//     }
//   }

//   delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   // Get available batches for production
//   async getAvailableBatches() {
//     try {
//       const batches = await this.makeRequest('/batch');
      
//       const availableBatches = batches.filter(batch => {
//         const isValidStage = ['due', 'start-processing'].includes(batch.stage);
//         const hasValidStructure = batch.Product?.Recipe?.steps?.steps?.length > 0;
//         return isValidStage && hasValidStructure;
//       });

//       return availableBatches;
//     } catch (error) {
//       console.error('Failed to fetch available batches:', error);
//       throw new Error(`Unable to load production batches: ${error.message}`);
//     }
//   }

//   // Start production - initialize currentSteps in database
//   async startProduction(batchId) {
//     try {
//       console.log(`Starting production for batch ${batchId}`);
      
//       // Get the batch first to access the recipe
//       const batch = await this.makeRequest(`/batch/${batchId}`);
//       const recipeSteps = batch.Product.Recipe.steps.steps;
      
//       // Initialize currentSteps array based on recipe
//       const initialCurrentSteps = recipeSteps.map(step => ({
//         stepNumber: step.number,
//         name: step.name,
//         completed: false,
//         // startedAt: null,
//         // completedAt: null,
//         // actualDuration: null,
//         // notes: null,
//         // expectedDuration: step.duration,
//         // temperature: step.temperature,
//         // instructions: step.instructions
//       }));
      
//       const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           stage: 'start-processing',
//           currentSteps: initialCurrentSteps
//         }),
//       });
      
//       console.log(`Batch ${batchId} updated to start-processing with initialized steps`);
//       return updatedBatch;
//     } catch (error) {
//       console.error(`Failed to start production for batch ${batchId}:`, error);
//       throw new Error(`Cannot start production: ${error.message}`);
//     }
//   }

//   // Complete a specific step and update database using existing PATCH endpoint
//   async completeStep(batchId, stepData) {
//     try {
//       console.log(`Completing step for batch ${batchId}:`, stepData);
      
//       // Get current batch to access currentSteps
//       const currentBatch = await this.makeRequest(`/batch/${batchId}`);
//       let currentSteps = currentBatch.currentSteps || [];
      
//       // Update the specific step in currentSteps array
//       // Note: using 'number' field to match your database structure
//       currentSteps = currentSteps.map(step => {
//         if (step.stepNumber === stepData.stepNumber) {
//           return {
//             ...step,
//             completed: true,
//             // completedAt: stepData.completedAt || new Date().toISOString(),
//             // actualDuration: stepData.actualDuration,
//             // notes: stepData.notes || ''
//           };
//         }
//         return step;
//       });
      
//       // Use existing PATCH endpoint to update batch
//       const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           currentSteps: currentSteps
//         }),
//       });
      
//       console.log(`Step ${stepData.stepNumber} completed for batch ${batchId}`);
//       return updatedBatch;
//     } catch (error) {
//       console.error(`Failed to complete step for batch ${batchId}:`, error);
//       throw new Error(`Cannot complete step: ${error.message}`);
//     }
//   }

//   // Get current step progress for resuming
//   getBatchProgress(batch) {
//     if (!batch.currentSteps || !Array.isArray(batch.currentSteps)) {
//       return {
//         activeStepIndex: 0,
//         completedSteps: [],
//         totalSteps: batch.Product?.Recipe?.steps?.steps?.length || 0
//       };
//     }
    
//     const completedSteps = batch.currentSteps
//       .filter(step => step.completed)
//       .map(step => ({
//         stepNumber: step.number, // Use 'number' field from database
//         stepName: step.name,
//         completedAt: step.completedAt,
//         actualDuration: step.actualDuration,
//         notes: step.notes
//       }));
    
//     const activeStepIndex = batch.currentSteps.findIndex(step => !step.completed);
    
//     return {
//       activeStepIndex: activeStepIndex === -1 ? batch.currentSteps.length : activeStepIndex,
//       completedSteps: completedSteps,
//       totalSteps: batch.currentSteps.length,
//       progress: (completedSteps.length / batch.currentSteps.length) * 100
//     };
//   }

//   // Finish processing when all steps are complete
//   async finishProcessing(batchId, completionData) {
//     try {
//       console.log(`Finishing processing for batch ${batchId}`);
      
//       const updateData = {
//         stage: 'end-processing',
//         finishedAt: new Date().toISOString(),
//         notes: JSON.stringify({
//           completedSteps: completionData.completedSteps || [],
//           actualDuration: completionData.totalDuration || 0,
//           actualYield: completionData.yield || 0,
//           productionNotes: completionData.notes || 'All production steps completed successfully',
//           completedAt: new Date().toISOString()
//         })
//       };
      
//       const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
//         method: 'PATCH',
//         body: JSON.stringify(updateData),
//       });
      
//       console.log(`Batch ${batchId} processing completed`);
//       return updatedBatch;
//     } catch (error) {
//       console.error(`Failed to finish processing for batch ${batchId}:`, error);
//       throw new Error(`Cannot complete processing: ${error.message}`);
//     }
//   }

//   async startPackaging(batchId) {
//     try {
//       return await this.makeRequest(`/batch/${batchId}`, {
//         method: 'PATCH',
//         body: JSON.stringify({ stage: 'packaging' }),
//       });
//     } catch (error) {
//       console.error(`Failed to start packaging for batch ${batchId}:`, error);
//       throw new Error(`Cannot start packaging: ${error.message}`);
//     }
//   }

//   async completeBatch(batchId, finalData = {}) {
//     try {
//       return await this.makeRequest(`/batch/${batchId}`, {
//         method: 'PATCH',
//         body: JSON.stringify({
//           stage: 'done',
//           finishedAt: new Date().toISOString(),
//           notes: finalData.notes || 'Batch completed successfully'
//         }),
//       });
//     } catch (error) {
//       console.error(`Failed to complete batch ${batchId}:`, error);
//       throw new Error(`Cannot complete batch: ${error.message}`);
//     }
//   }
// }

// export default new FactoryApiService();

// services/factory/factoryApiService.js

const API_BASE_URL ='http://localhost:5000';

class FactoryApiService {
  constructor() {
    this.requestTimeout = 10000;
    this.maxRetries = 3;
  }

  /**
   * Get authentication token from localStorage
   * @returns {string|null} Authentication token
   */
  getAuthToken() {
    return localStorage.getItem('token') || null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`,
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        };

        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API request attempt ${attempt} failed: ${endpoint}`, error);
        
        if (attempt === this.maxRetries || error.name === 'AbortError') {
          throw new Error(`Request failed after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get available batches for production
  async getAvailableBatches() {
    try {
      const batches = await this.makeRequest('/batch');
      
      const availableBatches = batches.filter(batch => {
        const isValidStage = ['due', 'start-processing'].includes(batch.stage);
        const hasValidStructure = batch.Product?.Recipe?.steps?.steps?.length > 0;
        return isValidStage && hasValidStructure;
      });

      return availableBatches;
    } catch (error) {
      console.error('Failed to fetch available batches:', error);
      throw new Error(`Unable to load production batches: ${error.message}`);
    }
  }

  // Start production - initialize currentSteps in database
  async startProduction(batchId) {
    try {
      console.log(`Starting production for batch ${batchId}`);
      
      // Get the batch first to access the recipe
      const batch = await this.makeRequest(`/batch/${batchId}`);
      const recipeSteps = batch.Product.Recipe.steps.steps;
      
      // Initialize currentSteps array based on recipe
      const initialCurrentSteps = recipeSteps.map(step => ({
        stepNumber: step.number,
        name: step.name,
        completed: false,
        // startedAt: null,
        // completedAt: null,
        // actualDuration: null,
        // notes: null,
        // expectedDuration: step.duration,
        // temperature: step.temperature,
        // instructions: step.instructions
      }));
      
      const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'start-processing',
          currentSteps: initialCurrentSteps
        }),
      });
      
      console.log(`Batch ${batchId} updated to start-processing with initialized steps`);
      return updatedBatch;
    } catch (error) {
      console.error(`Failed to start production for batch ${batchId}:`, error);
      throw new Error(`Cannot start production: ${error.message}`);
    }
  }

  // Complete a specific step and update database using existing PATCH endpoint
  async completeStep(batchId, stepData) {
    try {
      console.log(`Completing step for batch ${batchId}:`, stepData);
      
      // Get current batch to access currentSteps
      const currentBatch = await this.makeRequest(`/batch/${batchId}`);
      let currentSteps = currentBatch.currentSteps || [];
      
      // Update the specific step in currentSteps array
      // Note: using 'number' field to match your database structure
      currentSteps = currentSteps.map(step => {
        if (step.stepNumber === stepData.stepNumber) {
          return {
            ...step,
            completed: true,
            // completedAt: stepData.completedAt || new Date().toISOString(),
            // actualDuration: stepData.actualDuration,
            // notes: stepData.notes || ''
          };
        }
        return step;
      });
      
      // Use existing PATCH endpoint to update batch
      const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          currentSteps: currentSteps
        }),
      });
      
      console.log(`Step ${stepData.stepNumber} completed for batch ${batchId}`);
      return updatedBatch;
    } catch (error) {
      console.error(`Failed to complete step for batch ${batchId}:`, error);
      throw new Error(`Cannot complete step: ${error.message}`);
    }
  }

  // Get current step progress for resuming
  getBatchProgress(batch) {
    if (!batch.currentSteps || !Array.isArray(batch.currentSteps)) {
      return {
        activeStepIndex: 0,
        completedSteps: [],
        totalSteps: batch.Product?.Recipe?.steps?.steps?.length || 0
      };
    }
    
    const completedSteps = batch.currentSteps
      .filter(step => step.completed)
      .map(step => ({
        stepNumber: step.number, // Use 'number' field from database
        stepName: step.name,
        completedAt: step.completedAt,
        actualDuration: step.actualDuration,
        notes: step.notes
      }));
    
    const activeStepIndex = batch.currentSteps.findIndex(step => !step.completed);
    
    return {
      activeStepIndex: activeStepIndex === -1 ? batch.currentSteps.length : activeStepIndex,
      completedSteps: completedSteps,
      totalSteps: batch.currentSteps.length,
      progress: (completedSteps.length / batch.currentSteps.length) * 100
    };
  }

  // Finish processing when all steps are complete
  async finishProcessing(batchId, completionData) {
    try {
      console.log(`Finishing processing for batch ${batchId}`);
      
      const updateData = {
        stage: 'end-processing',
        finishedAt: new Date().toISOString(),
        notes: JSON.stringify({
          completedSteps: completionData.completedSteps || [],
          actualDuration: completionData.totalDuration || 0,
          actualYield: completionData.yield || 0,
          productionNotes: completionData.notes || 'All production steps completed successfully',
          completedAt: new Date().toISOString()
        })
      };
      
      const updatedBatch = await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      
      console.log(`Batch ${batchId} processing completed`);
      return updatedBatch;
    } catch (error) {
      console.error(`Failed to finish processing for batch ${batchId}:`, error);
      throw new Error(`Cannot complete processing: ${error.message}`);
    }
  }

  async startPackaging(batchId) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: 'packaging' }),
      });
    } catch (error) {
      console.error(`Failed to start packaging for batch ${batchId}:`, error);
      throw new Error(`Cannot start packaging: ${error.message}`);
    }
  }

  async completeBatch(batchId, finalData = {}) {
    try {
      return await this.makeRequest(`/batch/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          stage: 'done',
          finishedAt: new Date().toISOString(),
          notes: finalData.notes || 'Batch completed successfully'
        }),
      });
    } catch (error) {
      console.error(`Failed to complete batch ${batchId}:`, error);
      throw new Error(`Cannot complete batch: ${error.message}`);
    }
  }
}

export default new FactoryApiService();