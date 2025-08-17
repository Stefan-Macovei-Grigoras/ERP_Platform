
import React, { useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';

// Factory Components
import ProductSelection from './../components/factory/ProductSelection';
import ProductionSteps from './../components/factory/ProductionSteps';

// API Service
import factoryApiService from '.././services/factory/factoryApiService';

function FactoryDashboard() {
  const [currentView, setCurrentView] = useState('selection'); // 'selection' or 'production'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [resumeMode, setResumeMode] = useState(false); // Track if we're resuming a batch

  // Debug logging
  console.log('FactoryDashboard render - currentView:', currentView, 'selectedProduct:', selectedProduct, 'resumeMode:', resumeMode);

  // Show notification
  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Handle product selection - this starts a new production session
  const handleProductSelect = (batch) => {
    console.log('Batch selected for production:', batch);
    setSelectedProduct(batch);
    setCurrentView('production');
    setResumeMode(false); // This is a new batch
    
    showNotification(
      `Production session started for ${batch.Product?.name} (Batch ID: ${batch.id})`, 
      'info'
    );
  };

  // Handle resuming an in-progress batch
  const handleResumeProduction = (batch) => {
    console.log('Resuming production for batch:', batch);
    setSelectedProduct(batch);
    setCurrentView('production');
    setResumeMode(true); // This is a resumed batch
    
    showNotification(
      `Resuming production for ${batch.Product?.name} (Batch ID: ${batch.id})`, 
      'warning'
    );
  };

  // Handle back to selection
  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedProduct(null);
    setResumeMode(false);
  };

  // Handle production completion - processing stage finished
  const handleProductionComplete = async (productionData) => {
    console.log('Production processing completed:', productionData);
    
    try {
      // Show success notification with detailed info
      showNotification(
        `Production completed! Batch ${productionData.batchId} - ${productionData.yield}kg produced in ${productionData.totalDuration} minutes`, 
        'success'
      );

      // Log detailed completion summary
      const completionSummary = {
        batchId: productionData.batchId,
        recipeId: productionData.recipeId,
        productId: productionData.productId,
        stage: productionData.stage,
        totalDuration: productionData.totalDuration,
        stepsCompleted: productionData.completedSteps.length,
        yield: productionData.yield,
        completedAt: new Date().toISOString()
      };
      console.log('Production Summary:', completionSummary);

      // Auto-return to selection after showing completion state
      setTimeout(() => {
        handleBackToSelection();
        showNotification('Ready for next production batch', 'info');
      }, 4000);

    } catch (error) {
      console.error('Error handling production completion:', error);
      showNotification('Error completing production process', 'error');
    }
  };

  // Handle packaging start (if you want to add this functionality)
  const handleStartPackaging = async (batchId) => {
    try {
      await factoryApiService.startPackaging(batchId);
      showNotification(`Packaging started for Batch ${batchId}`, 'info');
    } catch (error) {
      console.error('Failed to start packaging:', error);
      showNotification('Failed to start packaging', 'error');
    }
  };

  // Handle final batch completion (if you want to add this functionality)
  const handleCompleteBatch = async (batchId, finalData = {}) => {
    try {
      await factoryApiService.completeBatch(batchId, finalData);
      showNotification(`Batch ${batchId} completed successfully!`, 'success');
    } catch (error) {
      console.error('Failed to complete batch:', error);
      showNotification('Failed to complete batch', 'error');
    }
  };

  return (
    <Box sx={{ p: 3, width : "100%", minHeight: '100vh', backgroundColor: '#f5f5f5', position: 'fixed', top: 0, left: -4 }}>
      {/* Main Content */}
      {currentView === 'selection' ? (
        <ProductSelection 
          onProductSelect={handleProductSelect}
          onResumeProduction={handleResumeProduction}
        />
      ) : (
        <ProductionSteps 
          selectedBatch={selectedProduct}
          onBackToSelection={handleBackToSelection}
          onProductionComplete={handleProductionComplete}
          resumeMode={resumeMode}
        />
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FactoryDashboard;