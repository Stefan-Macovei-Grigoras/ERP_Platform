// components/factory/FactoryDashboard.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';

// Factory Components
import ProductSelection from './../components/factory/ProductSelection';
import ProductionSteps from './../components/factory/ProductionSteps';

function FactoryDashboard() {
  const [currentView, setCurrentView] = useState('selection'); // 'selection' or 'production'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCurrentView('production');
  };

  // Handle back to selection
  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedProduct(null);
  };

  // Handle production completion
  const handleProductionComplete = (productionData) => {
    console.log('Production completed with data:', productionData);
    
    // Here you would typically:
    // 1. Send data to backend API
    // 2. Update batch status
    // 3. Create production record
    // 4. Notify other systems
    
    // For now, just return to selection
    setTimeout(() => {
      handleBackToSelection();
    }, 2000);
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {currentView === 'selection' ? (
        <ProductSelection onProductSelect={handleProductSelect} />
      ) : (
        <ProductionSteps 
          selectedProduct={selectedProduct}
          onBackToSelection={handleBackToSelection}
          onProductionComplete={handleProductionComplete}
        />
      )}
    </Box>
  );
}

export default FactoryDashboard;

