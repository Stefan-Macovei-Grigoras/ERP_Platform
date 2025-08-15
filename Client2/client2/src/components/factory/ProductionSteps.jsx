// // components/factory/ProductionSteps.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   Card,
//   CardContent,
//   LinearProgress,
//   Chip,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField
// } from '@mui/material';
// import {
//   CheckCircle,
//   PlayArrow,
//   Pause,
//   Stop,
//   Timer,
//   Thermostat,
//   ArrowBack,
//   Done
// } from '@mui/icons-material';

// function ProductionSteps({ selectedProduct, onBackToSelection, onProductionComplete }) {
//   const [activeStep, setActiveStep] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState([]);
//   const [currentStepStartTime, setCurrentStepStartTime] = useState(null);
//   const [stepTimers, setStepTimers] = useState({});
//   const [confirmDialog, setConfirmDialog] = useState(false);
//   const [stepNotes, setStepNotes] = useState('');
//   const [productionStarted, setProductionStarted] = useState(false);

//   const steps = selectedProduct?.steps?.steps || [];

//   // Calculate total progress
//   const progress = (completedSteps.length / steps.length) * 100;

//   // Start production
//   const handleStartProduction = () => {
//     setProductionStarted(true);
//     setCurrentStepStartTime(new Date());
//   };

//   // Complete current step
//   const handleCompleteStep = () => {
//     setConfirmDialog(true);
//   };

//   // Confirm step completion
//   const handleConfirmStepCompletion = () => {
//     const stepEndTime = new Date();
//     const stepDuration = currentStepStartTime 
//       ? Math.round((stepEndTime - currentStepStartTime) / 60000) // minutes
//       : steps[activeStep]?.duration || 0;

//     // Add to completed steps
//     setCompletedSteps(prev => [...prev, {
//       stepNumber: activeStep + 1,
//       stepId: steps[activeStep]?.number,
//       stepName: steps[activeStep]?.name,
//       completedAt: stepEndTime,
//       actualDuration: stepDuration,
//       notes: stepNotes
//     }]);

//     // Update timers
//     setStepTimers(prev => ({
//       ...prev,
//       [activeStep]: stepDuration
//     }));

//     // Move to next step or complete production
//     if (activeStep < steps.length - 1) {
//       setActiveStep(activeStep + 1);
//       setCurrentStepStartTime(new Date());
//     } else {
//       // Production complete
//       handleProductionComplete();
//     }

//     // Reset dialog
//     setConfirmDialog(false);
//     setStepNotes('');
//   };

//   // Complete entire production
//   const handleProductionComplete = () => {
//     const productionData = {
//       productId: selectedProduct.productId,
//       recipeId: selectedProduct.id,
//       completedSteps: completedSteps,
//       totalDuration: Object.values(stepTimers).reduce((sum, time) => sum + time, 0),
//       yield: selectedProduct.yield,
//       completedAt: new Date()
//     };

//     console.log('Production completed:', productionData);
//     onProductionComplete(productionData);
//   };

//   // Format duration
//   const formatDuration = (minutes) => {
//     if (minutes < 60) return `${minutes}min`;
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;
//     return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
//   };

//   // Get step status
//   const getStepStatus = (stepIndex) => {
//     if (completedSteps.some(cs => cs.stepNumber === stepIndex + 1)) {
//       return 'completed';
//     }
//     if (stepIndex === activeStep && productionStarted) {
//       return 'active';
//     }
//     return 'pending';
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Button 
//             startIcon={<ArrowBack />}
//             onClick={onBackToSelection}
//             sx={{ mb: 1 }}
//           >
//             Back to Selection
//           </Button>
//           <Typography variant="h5" fontWeight="bold">
//             Production: {selectedProduct?.Product?.name}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Recipe: {selectedProduct?.name} | Yield: {selectedProduct?.yield}kg
//           </Typography>
//         </Box>
//         <Box textAlign="right">
//           <Typography variant="h6" color="primary">
//             {Math.round(progress)}% Complete
//           </Typography>
//           <LinearProgress 
//             variant="determinate" 
//             value={progress} 
//             sx={{ width: 200, mt: 1 }}
//           />
//         </Box>
//       </Box>

//       {/* Start Production Button */}
//       {!productionStarted && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography>Ready to start production? Click the button to begin.</Typography>
//             <Button 
//               variant="contained"
//               startIcon={<PlayArrow />}
//               onClick={handleStartProduction}
//               sx={{ ml: 2 }}
//             >
//               Start Production
//             </Button>
//           </Box>
//         </Alert>
//       )}

//       {/* Production Steps */}
//       <Paper elevation={2} sx={{ p: 3 }}>
//         <Stepper activeStep={activeStep} orientation="vertical">
//           {steps.map((step, index) => {
//             const status = getStepStatus(index);
//             const isCompleted = status === 'completed';
//             const isActive = status === 'active';

//             return (
//               <Step key={index} completed={isCompleted}>
//                 <StepLabel
//                   icon={isCompleted ? <CheckCircle color="success" /> : undefined}
//                   sx={{
//                     '& .MuiStepLabel-label': {
//                       fontWeight: isActive ? 'bold' : 'normal',
//                       color: isActive ? 'primary.main' : 'inherit'
//                     }
//                   }}
//                 >
//                   <Box display="flex" alignItems="center" gap={2}>
//                     <Typography variant="h6">
//                       {step.name}
//                     </Typography>
//                     {isActive && (
//                       <Chip 
//                         label="In Progress" 
//                         color="primary" 
//                         size="small"
//                         icon={<Timer />}
//                       />
//                     )}
//                     {isCompleted && (
//                       <Chip 
//                         label="Completed" 
//                         color="success" 
//                         size="small"
//                         icon={<Done />}
//                       />
//                     )}
//                   </Box>
//                 </StepLabel>

//                 <StepContent>
//                   <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
//                     <CardContent>
//                       {/* Step Details */}
//                       <Typography variant="body1" mb={2}>
//                         {step.instructions}
//                       </Typography>

//                       {/* Step Parameters */}
//                       <Box display="flex" gap={2} mb={2}>
//                         <Chip 
//                           label={`${formatDuration(step.duration)}`}
//                           icon={<Timer />}
//                           size="small"
//                           variant="outlined"
//                         />
//                         <Chip 
//                           label={`${step.temperature}°C`}
//                           icon={<Thermostat />}
//                           size="small"
//                           variant="outlined"
//                           color="secondary"
//                         />
//                       </Box>

//                       {/* Action Buttons */}
//                       {isActive && productionStarted && (
//                         <Box display="flex" gap={2} mt={2}>
//                           <Button 
//                             variant="contained"
//                             onClick={handleCompleteStep}
//                             startIcon={<CheckCircle />}
//                             color="success"
//                           >
//                             Complete Step
//                           </Button>
//                           <Button 
//                             variant="outlined"
//                             startIcon={<Pause />}
//                           >
//                             Pause
//                           </Button>
//                         </Box>
//                       )}

//                       {/* Completed Step Info */}
//                       {isCompleted && (
//                         <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
//                           <Typography variant="body2" color="success.dark">
//                             ✓ Completed at {completedSteps.find(cs => cs.stepNumber === index + 1)?.completedAt?.toLocaleTimeString()}
//                           </Typography>
//                           {stepTimers[index] && (
//                             <Typography variant="body2" color="success.dark">
//                               Actual duration: {formatDuration(stepTimers[index])}
//                             </Typography>
//                           )}
//                         </Box>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </StepContent>
//               </Step>
//             );
//           })}
//         </Stepper>

//         {/* Production Complete */}
//         {completedSteps.length === steps.length && (
//           <Box mt={4} p={3} bgcolor="success.light" borderRadius={2} textAlign="center">
//             <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
//             <Typography variant="h5" color="success.dark" fontWeight="bold" mb={1}>
//               Production Complete!
//             </Typography>
//             <Typography variant="body1" color="success.dark" mb={2}>
//               All {steps.length} steps have been completed successfully.
//             </Typography>
//             <Button 
//               variant="contained"
//               color="success"
//               size="large"
//               onClick={onBackToSelection}
//             >
//               Return to Product Selection
//             </Button>
//           </Box>
//         )}
//       </Paper>

//       {/* Confirm Step Completion Dialog */}
//       <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Confirm Step Completion
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" mb={2}>
//             Are you ready to mark this step as complete?
//           </Typography>
//           <Typography variant="h6" mb={2}>
//             {steps[activeStep]?.name}
//           </Typography>
//           <TextField
//             label="Notes (optional)"
//             multiline
//             rows={3}
//             fullWidth
//             value={stepNotes}
//             onChange={(e) => setStepNotes(e.target.value)}
//             placeholder="Add any notes about this step..."
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDialog(false)}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleConfirmStepCompletion}
//             variant="contained"
//             color="success"
//           >
//             Complete Step
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default ProductionSteps;

// components/factory/ProductionSteps.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CheckCircle,
  PlayArrow,
  Pause,
  Timer,
  Thermostat,
  ArrowBack,
  Done
} from '@mui/icons-material';

// Import the API service
import factoryApiService from '../../services/factory/factoryApiService';

function ProductionSteps({ selectedBatch, onBackToSelection, onProductionComplete }) {
  // Debug logging
  console.log('ProductionSteps received selectedBatch:', selectedBatch);
  
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStepStartTime, setCurrentStepStartTime] = useState(null);
  const [stepTimers, setStepTimers] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [stepNotes, setStepNotes] = useState('');
  const [productionStarted, setProductionStarted] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(selectedBatch);
  const [loading, setLoading] = useState(false);

  const recipe = selectedBatch?.Product?.Recipe;
  const steps = recipe?.steps?.steps || [];

  // Debug logging for recipe and steps
  console.log('Recipe:', recipe);
  console.log('Steps:', steps);

  // Early return if no valid batch
  if (!selectedBatch) {
    return (
      <Box p={3}>
        <Alert severity="error">
          <Typography>No batch selected. Please return to batch selection.</Typography>
          <Button onClick={onBackToSelection} sx={{ mt: 2 }}>
            Back to Selection
          </Button>
        </Alert>
      </Box>
    );
  }

  // Early return if no recipe or steps
  if (!recipe || !steps.length) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          <Typography>This batch has no recipe or production steps defined.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Batch ID: {selectedBatch.id} | Product: {selectedBatch.Product?.name}
          </Typography>
          {recipe && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Recipe: {recipe.name} | Steps found: {steps.length}
            </Typography>
          )}
          <Button onClick={onBackToSelection} sx={{ mt: 2 }}>
            Back to Selection
          </Button>
        </Alert>
      </Box>
    );
  }

  // Calculate total progress
  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  // Start production - update batch stage to 'start-processing'
  const handleStartProduction = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid batch
      if (!selectedBatch || !selectedBatch.id) {
        throw new Error('Invalid batch selected');
      }
      
      // Update batch stage to 'start-processing'
      const updatedBatch = await factoryApiService.startProduction(selectedBatch.id);
      setCurrentBatch(updatedBatch);
      
      setProductionStarted(true);
      setCurrentStepStartTime(new Date());
      
      console.log(`[PRODUCTION START] Batch ${selectedBatch.id} stage updated to 'start-processing'`);
    } catch (error) {
      console.error('Failed to start production:', error);
      alert(`Failed to start production: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Complete current step
  const handleCompleteStep = () => {
    setConfirmDialog(true);
  };

  // Confirm step completion
  const handleConfirmStepCompletion = async () => {
    try {
      const stepEndTime = new Date();
      const stepDuration = currentStepStartTime 
        ? Math.round((stepEndTime - currentStepStartTime) / 60000) // minutes
        : steps[activeStep]?.duration || 0;

      const stepData = {
        stepNumber: activeStep + 1,
        stepId: steps[activeStep]?.number,
        stepName: steps[activeStep]?.name,
        completedAt: stepEndTime,
        actualDuration: stepDuration,
        expectedDuration: steps[activeStep]?.duration,
        temperature: steps[activeStep]?.temperature,
        notes: stepNotes
      };

      // Add to completed steps
      const newCompletedSteps = [...completedSteps, stepData];
      setCompletedSteps(newCompletedSteps);

      // Update timers
      setStepTimers(prev => ({
        ...prev,
        [activeStep]: stepDuration
      }));

      console.log(`[STEP COMPLETE] Step ${activeStep + 1}: ${steps[activeStep]?.name} completed in ${stepDuration} minutes`);

      // Move to next step or complete production
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        setCurrentStepStartTime(new Date());
      } else {
        // All steps complete - finish processing stage
        if (steps.length > 0) { // Only complete if we actually have steps
          await handleProcessingComplete(newCompletedSteps);
        }
      }

      // Reset dialog
      setConfirmDialog(false);
      setStepNotes('');
      
    } catch (error) {
      console.error('Failed to complete step:', error);
      alert('Failed to complete step. Please try again.');
    }
  };

  // Complete processing stage - update batch to 'end-processing'
  const handleProcessingComplete = async (finalCompletedSteps) => {
    try {
      setLoading(true);
      
      const totalDuration = Object.values(stepTimers).reduce((sum, time) => sum + time, 0);
      
      const completionData = {
        yield: recipe?.yield || 0,
        totalDuration: totalDuration,
        completedSteps: finalCompletedSteps,
        notes: 'All production steps completed successfully'
      };

      // Update batch stage to 'end-processing'
      const updatedBatch = await factoryApiService.finishProcessing(
        currentBatch.id, 
        completionData
      );
      
      setCurrentBatch(updatedBatch);
      
      console.log(`[PROCESSING COMPLETE] Batch ${currentBatch.id} stage updated to 'end-processing'`);
      
      // Call the parent completion handler
      onProductionComplete({
        ...completionData,
        batchId: currentBatch.id,
        productId: selectedBatch.productId,
        stage: 'end-processing'
      });
      
    } catch (error) {
      console.error('Failed to complete processing:', error);
      alert('Failed to complete processing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't show completion state if there are no steps or we haven't started
  const shouldShowCompletion = steps.length > 0 && completedSteps.length === steps.length && productionStarted;

  // Format duration helper
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) { // Less than 24 hours
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    } else { // 24 hours or more
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      const remainingMinutes = minutes % 60;
      
      let result = `${days}d`;
      if (remainingHours > 0) result += ` ${remainingHours}h`;
      if (remainingMinutes > 0) result += ` ${remainingMinutes}min`;
      
      return result;
    }
  };

  // Get step status
  const getStepStatus = (stepIndex) => {
    if (completedSteps.some(cs => cs.stepNumber === stepIndex + 1)) {
      return 'completed';
    }
    if (stepIndex === activeStep && productionStarted) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button 
            startIcon={<ArrowBack />}
            onClick={onBackToSelection}
            sx={{ mb: 1 }}
            disabled={loading}
          >
            Back to Selection
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Production: {selectedBatch?.Product?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Recipe: {recipe?.name} | Expected Yield: {recipe?.yield}kg | Batch ID: {selectedBatch?.id}
          </Typography>
          <Box display="flex" gap={1} mt={1}>
            <Chip 
              label={`Stage: ${currentBatch?.stage || selectedBatch?.stage}`} 
              color={currentBatch?.stage === 'start-processing' ? 'primary' : 'warning'} 
              size="small" 
            />
          </Box>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" color="primary">
            {Math.round(progress)}% Complete
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ width: 200, mt: 1 }}
          />
          <Typography variant="caption" color="textSecondary" display="block" mt={1}>
            {completedSteps.length} of {steps.length} steps done
          </Typography>
        </Box>
      </Box>

      {/* Production Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Recipe:</strong> {recipe?.name} | 
          <strong> Total Time:</strong> {formatDuration(recipe?.totalTime || 0)} | 
          <strong> Steps:</strong> {steps.length}
        </Typography>
      </Alert>

      {/* Start Production Button */}
      {!productionStarted && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Ready to start production? This will update the batch status to 'start-processing'.</Typography>
            <Button 
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleStartProduction}
              disabled={loading}
              sx={{ ml: 2 }}
            >
              {loading ? 'Starting...' : 'Start Production'}
            </Button>
          </Box>
        </Alert>
      )}

      {/* Production Steps */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';

            return (
              <Step key={index} completed={isCompleted}>
                <StepLabel
                  icon={isCompleted ? <CheckCircle color="success" /> : undefined}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'primary.main' : 'inherit'
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <Typography variant="h6">
                      Step {step.number}: {step.name}
                    </Typography>
                    {isActive && (
                      <Chip 
                        label="In Progress" 
                        color="primary" 
                        size="small"
                        icon={<Timer />}
                      />
                    )}
                    {isCompleted && (
                      <Chip 
                        label="Completed" 
                        color="success" 
                        size="small"
                        icon={<Done />}
                      />
                    )}
                  </Box>
                </StepLabel>

                <StepContent>
                  <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
                    <CardContent>
                      {/* Step Instructions */}
                      <Typography variant="body1" mb={2} sx={{ fontStyle: 'italic' }}>
                        "{step.instructions}"
                      </Typography>

                      {/* Step Parameters */}
                      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                        <Chip 
                          label={`Expected: ${formatDuration(step.duration)}`}
                          icon={<Timer />}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={`Temperature: ${step.temperature}°C`}
                          icon={<Thermostat />}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                        {isActive && currentStepStartTime && (
                          <Chip 
                            label={`Started: ${currentStepStartTime.toLocaleTimeString()}`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                      </Box>

                      {/* Action Buttons */}
                      {isActive && productionStarted && (
                        <Box display="flex" gap={2} mt={2}>
                          <Button 
                            variant="contained"
                            onClick={handleCompleteStep}
                            startIcon={<CheckCircle />}
                            color="success"
                            disabled={loading}
                          >
                            Complete Step
                          </Button>
                          <Button 
                            variant="outlined"
                            startIcon={<Pause />}
                            disabled={loading}
                          >
                            Pause
                          </Button>
                        </Box>
                      )}

                      {/* Completed Step Info */}
                      {isCompleted && (
                        <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                          <Typography variant="body2" color="success.dark">
                            ✓ Completed at {completedSteps.find(cs => cs.stepNumber === index + 1)?.completedAt?.toLocaleTimeString()}
                          </Typography>
                          {stepTimers[index] && (
                            <Typography variant="body2" color="success.dark">
                              Actual duration: {formatDuration(stepTimers[index])} 
                              {step.duration !== stepTimers[index] && (
                                <span> (Expected: {formatDuration(step.duration)})</span>
                              )}
                            </Typography>
                          )}
                          {completedSteps.find(cs => cs.stepNumber === index + 1)?.notes && (
                            <Typography variant="body2" color="success.dark" sx={{ mt: 1, fontStyle: 'italic' }}>
                              Notes: {completedSteps.find(cs => cs.stepNumber === index + 1)?.notes}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {/* Production Complete */}
        {shouldShowCompletion && (
          <Box mt={4} p={3} bgcolor="success.light" borderRadius={2} textAlign="center">
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold" mb={1}>
              Processing Complete!
            </Typography>
            <Typography variant="body1" color="success.dark" mb={2}>
              All {steps.length} steps completed successfully. Batch #{currentBatch?.id} is ready for packaging.
            </Typography>
            <Typography variant="body2" color="success.dark" mb={2}>
              Total Production Time: {formatDuration(Object.values(stepTimers).reduce((sum, time) => sum + time, 0))}
            </Typography>
            <Button 
              variant="contained"
              color="success"
              size="large"
              onClick={onBackToSelection}
              disabled={loading}
            >
              Return to Batch Selection
            </Button>
          </Box>
        )}

        {/* Debug Info - Remove this after fixing */}
        {process.env.NODE_ENV === 'development' && (
          <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="caption" display="block">Debug Info:</Typography>
            <Typography variant="caption" display="block">Steps length: {steps.length}</Typography>
            <Typography variant="caption" display="block">Completed steps: {completedSteps.length}</Typography>
            <Typography variant="caption" display="block">Production started: {productionStarted.toString()}</Typography>
            <Typography variant="caption" display="block">Should show completion: {shouldShowCompletion.toString()}</Typography>
            <Typography variant="caption" display="block">Recipe: {recipe ? 'Found' : 'Missing'}</Typography>
            <Typography variant="caption" display="block">Steps array: {JSON.stringify(steps?.slice(0, 2))}</Typography>
          </Box>
        )}
      </Paper>

      {/* Confirm Step Completion Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm Step Completion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            Are you ready to mark this step as complete?
          </Typography>
          <Typography variant="h6" mb={2} color="primary">
            Step {steps[activeStep]?.number}: {steps[activeStep]?.name}
          </Typography>
          <Typography variant="body2" mb={2} color="textSecondary">
            Expected duration: {formatDuration(steps[activeStep]?.duration)} | Temperature: {steps[activeStep]?.temperature}°C
          </Typography>
          <TextField
            label="Notes (optional)"
            multiline
            rows={3}
            fullWidth
            value={stepNotes}
            onChange={(e) => setStepNotes(e.target.value)}
            placeholder="Add any observations, deviations, or notes about this step..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmStepCompletion}
            variant="contained"
            color="success"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Complete Step'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductionSteps;