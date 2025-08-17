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
  TextField,
  Grid
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

// Import the API service and sensor component
import factoryApiService from '../../services/factory/factoryApiService';
import SensorDataDisplay from '../shared/SensorDataDisplay';

function ProductionSteps({ selectedBatch, onBackToSelection, onProductionComplete }) {
  // Debug logging
  //console.log('ProductionSteps received selectedBatch:', selectedBatch);
  
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

  // Initialize state based on batch data when component mounts
  useEffect(() => {
    if (selectedBatch) {
      console.log('Initializing from batch data:', selectedBatch);
      
      // Check if batch is already in processing with currentSteps
      const isInProgress = selectedBatch.stage === 'start-processing' && 
                          selectedBatch.currentSteps && 
                          Array.isArray(selectedBatch.currentSteps) &&
                          selectedBatch.currentSteps.length > 0;
      
      if (isInProgress) {
        console.log('Batch is in progress, loading existing progress');
        
        // Get progress from API service
        const progress = factoryApiService.getBatchProgress(selectedBatch);
        
        setCompletedSteps(progress.completedSteps);
        setActiveStep(progress.activeStepIndex);
        setProductionStarted(true);
        
        // Initialize step timers from completed steps
        const timers = {};
        progress.completedSteps.forEach(step => {
          if (step.actualDuration) {
            timers[step.stepNumber - 1] = step.actualDuration;
          }
        });
        setStepTimers(timers);
        
        console.log('Initialized state - activeStep:', progress.activeStepIndex, 'completedSteps:', progress.completedSteps.length);
      } else {
        console.log('Batch is new, starting fresh');
        // Reset state for new batch
        setCompletedSteps([]);
        setActiveStep(0);
        setProductionStarted(false);
        setStepTimers({});
      }
    }
  }, [selectedBatch]);

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
      
      //console.log(`[PRODUCTION START] Batch ${selectedBatch.id} stage updated to 'start-processing'`);
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

  // Confirm step completion and save to database
  // const handleConfirmStepCompletion = async () => {
  //   try {
  //     setLoading(true);
      
  //     const stepEndTime = new Date();
  //     const stepDuration = currentStepStartTime 
  //       ? Math.round((stepEndTime - currentStepStartTime) / 60000) // minutes
  //       : steps[activeStep]?.duration || 0;

  //     const stepData = {
  //       stepNumber: activeStep + 1,
  //       stepName: steps[activeStep]?.name,
  //       completedAt: stepEndTime,
  //       actualDuration: stepDuration,
  //       expectedDuration: steps[activeStep]?.duration,
  //       temperature: steps[activeStep]?.temperature,
  //       notes: stepNotes
  //     };

  //     // Save step completion to database using the API service
  //     const updatedBatch = await factoryApiService.completeStep(currentBatch.id, stepData);
  //     setCurrentBatch(updatedBatch);

  //     // Update local state from the updated batch data
  //     if (updatedBatch.currentSteps) {
  //       const progress = factoryApiService.getBatchProgress(updatedBatch);
  //       setCompletedSteps(progress.completedSteps);
  //     }

  //     // Update timers
  //     setStepTimers(prev => ({
  //       ...prev,
  //       [activeStep]: stepDuration
  //     }));

  //     console.log(`Step ${activeStep + 1} completed and saved to database`);

  //     // Move to next step or complete production
  //     if (activeStep < steps.length - 1) {
  //       setActiveStep(activeStep + 1);
  //       setCurrentStepStartTime(new Date());
  //     } else {
  //       // All steps complete - finish processing stage
  //       const finalCompletedSteps = updatedBatch.currentSteps?.filter(step => step.completed) || [];
  //       await handleProcessingComplete(finalCompletedSteps);
  //     }

  //     // Reset dialog
  //     setConfirmDialog(false);
  //     setStepNotes('');
      
  //   } catch (error) {
  //     console.error('Failed to complete step:', error);
  //     alert('Failed to complete step. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleConfirmStepCompletion = async () => {
  try {
    setLoading(true);
    
    const stepEndTime = new Date();
    const stepDuration = currentStepStartTime 
      ? Math.round((stepEndTime - currentStepStartTime) / 60000) // minutes
      : steps[activeStep]?.duration || 0;

    const stepData = {
      stepNumber: activeStep + 1,
      stepName: steps[activeStep]?.name,
      completedAt: stepEndTime,
      actualDuration: stepDuration,
      expectedDuration: steps[activeStep]?.duration,
      temperature: steps[activeStep]?.temperature,
      notes: stepNotes
    };

    // Save step completion to database using the API service
    const updatedBatch = await factoryApiService.completeStep(currentBatch.id, stepData);
    setCurrentBatch(updatedBatch);

    // Immediately update local state - don't wait for batch progress calculation
    const newCompletedSteps = [...completedSteps, stepData];
    setCompletedSteps(newCompletedSteps);

    // Update timers
    setStepTimers(prev => ({
      ...prev,
      [activeStep]: stepDuration
    }));

    console.log(`Step ${activeStep + 1} completed and saved to database`);

    // Move to next step or complete production
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setCurrentStepStartTime(new Date());
    } else {
      // All steps complete - finish processing stage
      await handleProcessingComplete(newCompletedSteps);
    }

    // Reset dialog
    setConfirmDialog(false);
    setStepNotes('');
    
  } catch (error) {
    console.error('Failed to complete step:', error);
    alert('Failed to complete step. Please try again.');
  } finally {
    setLoading(false);
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

  // Get step status - updated to work with persisted data
  const getStepStatus = (stepIndex) => {
    // Check if this step is completed in our local state
    const isCompletedLocal = completedSteps.some(cs => cs.stepNumber === stepIndex + 1);
    
    // Check if this step is completed in the database currentSteps
    const isCompletedDB = selectedBatch.currentSteps?.some(
      step => step.stepNumber === stepIndex + 1 && step.completed
    );
    
    if (isCompletedLocal || isCompletedDB) {
      return 'completed';
    }
    if (stepIndex === activeStep && productionStarted) {
      return 'active';
    }
    return 'pending';
  };

//   return (
//     <Box width="99vw">
//       {/* Header */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} width="97vw">
//         <Box width="90vw"> 
//           <Button 
//             startIcon={<ArrowBack />}
//             onClick={onBackToSelection}
//             sx={{ mb: 1 }}
//             disabled={loading}
//           >
//             Back to Selection
//           </Button>
//           <Typography variant="h5" fontWeight="bold">
//             Production: {selectedBatch?.Product?.name}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Recipe: {recipe?.name} | Expected Yield: {recipe?.yield}kg | Batch ID: {selectedBatch?.id}
//           </Typography>
//           <Box display="flex" gap={1} mt={1}>
//             <Chip 
//               label={`Stage: ${currentBatch?.stage || selectedBatch?.stage}`} 
//               color={currentBatch?.stage === 'start-processing' ? 'primary' : 'warning'} 
//               size="small" 
//             />
//           </Box>
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
//           <Typography variant="caption" color="textSecondary" display="block" mt={1}>
//             {completedSteps.length} of {steps.length} steps done
//           </Typography>
//         </Box>
//       </Box>

//       {/* Production Info Alert */}
//       <Alert severity="info" sx={{ mb: 3 }}>
//         <Typography variant="body2">
//           <strong>Recipe:</strong> {recipe?.name} | 
//           <strong> Total Time:</strong> {formatDuration(recipe?.totalTime || 0)} | 
//           <strong> Steps:</strong> {steps.length}
//         </Typography>
//       </Alert>

//       {/* Main Content Grid */}
//       <Grid container spacing={3}>
//         {/* Left Column - Sensor Data */}
//         <Grid item xs={12} lg={4}>
//           <Box sx={{ position: 'sticky', top: 24 }}>
//             <SensorDataDisplay />
//           </Box>
//         </Grid>

//         {/* Right Column - Production Steps */}
//         <Grid item xs={12} lg={8} >
//           {/* Start Production Button */}
//           {!productionStarted && (
//             <Alert severity="warning" sx={{ mb: 3 }}>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Typography>Ready to start production? This will update the batch status to 'start-processing'.</Typography>
//                 <Button 
//                   variant="contained"
//                   startIcon={<PlayArrow />}
//                   onClick={handleStartProduction}
//                   disabled={loading}
//                   sx={{ ml: 2 }}
//                 >
//                   {loading ? 'Starting...' : 'Start Production'}
//                 </Button>
//               </Box>
//             </Alert>
//           )}

//           {/* Production Steps */}
//           <Paper elevation={2} sx={{ p: 3,  overflow: 'auto'}}>
//             <Stepper activeStep={activeStep} orientation="vertical" >
//               {steps.map((step, index) => {
//                 const status = getStepStatus(index);
//                 const isCompleted = status === 'completed';
//                 const isActive = status === 'active';

//                 // Get completion data from database if available
//                 const completionData = selectedBatch.currentSteps?.find(
//                   dbStep => dbStep.stepNumber === index + 1 && dbStep.completed
//                 ) || completedSteps.find(cs => cs.stepNumber === index + 1);

//                 return (
//                   <Step key={index} completed={isCompleted}>
//                     <StepLabel
//                       icon={isCompleted ? <CheckCircle color="success" /> : undefined}
//                       sx={{
//                         '& .MuiStepLabel-label': {
//                           fontWeight: isActive ? 'bold' : 'normal',
//                           color: isActive ? 'primary.main' : 'inherit'
//                         }
//                       }}
//                     >
//                       <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
//                         <Typography variant="h6">
//                           Step {step.number}: {step.name}
//                         </Typography>
//                         {isActive && (
//                           <Chip 
//                             label="In Progress" 
//                             color="primary" 
//                             size="small"
//                             icon={<Timer />}
//                           />
//                         )}
//                         {isCompleted && (
//                           <Chip 
//                             label="Completed" 
//                             color="success" 
//                             size="small"
//                             icon={<Done />}
//                           />
//                         )}
//                       </Box>
//                     </StepLabel>

//                     <StepContent>
//                        <Box sx={{ 
//                         maxHeight: 250, 
//                         overflow: 'auto',
//                         pr: 1 
//                       }}>
//                       <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
//                         <CardContent>
//                           {/* Step Instructions */}
//                           <Typography variant="body1" mb={2} sx={{ fontStyle: 'italic' }}>
//                             "{step.instructions}"
//                           </Typography>

//                           {/* Step Parameters */}
//                           <Box display="flex" gap={2} mb={2} flexWrap="wrap">
//                             <Chip 
//                               label={`Expected: ${formatDuration(step.duration)}`}
//                               icon={<Timer />}
//                               size="small"
//                               variant="outlined"
//                             />
//                             <Chip 
//                               label={`Temperature: ${step.temperature}°C`}
//                               icon={<Thermostat />}
//                               size="small"
//                               variant="outlined"
//                               color="secondary"
//                             />
//                             {isActive && currentStepStartTime && (
//                               <Chip 
//                                 label={`Started: ${currentStepStartTime.toLocaleTimeString()}`}
//                                 size="small"
//                                 variant="outlined"
//                                 color="info"
//                               />
//                             )}
//                           </Box>

//                           {/* Action Buttons */}
//                           {isActive && productionStarted && (
//                             <Box display="flex" gap={2} mt={2}>
//                               <Button 
//                                 variant="contained"
//                                 onClick={handleCompleteStep}
//                                 startIcon={<CheckCircle />}
//                                 color="success"
//                                 disabled={loading}
//                               >
//                                 Complete Step
//                               </Button>
//                             </Box>
//                           )}

//                           {/* Completed Step Info - show data from database */}
//                           {isCompleted && completionData && (
//                             <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
//                               <Typography variant="body2" color="success.dark">
//                                 ✓ Completed {completionData.completedAt && `at ${new Date(completionData.completedAt).toLocaleTimeString()}`}
//                               </Typography>
//                               {completionData.actualDuration && (
//                                 <Typography variant="body2" color="success.dark">
//                                   Actual duration: {formatDuration(completionData.actualDuration)} 
//                                   {step.duration !== completionData.actualDuration && (
//                                     <span> (Expected: {formatDuration(step.duration)})</span>
//                                   )}
//                                 </Typography>
//                               )}
//                               {completionData.notes && (
//                                 <Typography variant="body2" color="success.dark" sx={{ mt: 1, fontStyle: 'italic' }}>
//                                   Notes: {completionData.notes}
//                                 </Typography>
//                               )}
//                             </Box>
//                           )}
//                         </CardContent>
//                       </Card>
//                       </Box>
//                     </StepContent>
//                   </Step>
//                 );
//               })}
//             </Stepper>

//             {/* Production Complete */}
//             {shouldShowCompletion && (
//               <Box mt={4} p={3} bgcolor="success.light" borderRadius={2} textAlign="center">
//                 <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
//                 <Typography variant="h5" color="success.dark" fontWeight="bold" mb={1}>
//                   Processing Complete!
//                 </Typography>
//                 <Typography variant="body1" color="success.dark" mb={2}>
//                   All {steps.length} steps completed successfully. Batch #{currentBatch?.id} is ready for packaging.
//                 </Typography>
//                 <Typography variant="body2" color="success.dark" mb={2}>
//                   Total Production Time: {formatDuration(Object.values(stepTimers).reduce((sum, time) => sum + time, 0))}
//                 </Typography>
//                 <Button 
//                   variant="contained"
//                   color="success"
//                   size="large"
//                   onClick={onBackToSelection}
//                   disabled={loading}
//                 >
//                   Return to Batch Selection
//                 </Button>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Confirm Step Completion Dialog */}
//       <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Confirm Step Completion
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" mb={2}>
//             Are you ready to mark this step as complete? This will be saved to the database.
//           </Typography>
//           <Typography variant="h6" mb={2} color="primary">
//             Step {steps[activeStep]?.number}: {steps[activeStep]?.name}
//           </Typography>
//           <Typography variant="body2" mb={2} color="textSecondary">
//             Expected duration: {formatDuration(steps[activeStep]?.duration)} | Temperature: {steps[activeStep]?.temperature}°C
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDialog(false)} disabled={loading}>
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleConfirmStepCompletion}
//             variant="contained"
//             color="success"
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : 'Complete Step'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default ProductionSteps;
 return (
    <Box width="99vw">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} width="97vw">
        <Box width="90vw"> 
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

      {/* Main Content Grid - Centered with proper spacing */}
      <Box sx={{ 
        height: 'calc(100vh - 300px)',
        display: 'flex',
        justifyContent: 'center',
        px: 2
      }}>
        <Grid container spacing={4} sx={{ maxWidth: '1400px', width: '100%', justifyContent: "space-evenly"}}>
          {/* Left Column - Sensor Data */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ 
              position: 'sticky', 
              top: 24,
              maxHeight: 'calc(100vh - 320px)',
              overflow: 'auto'
            }}>
              <SensorDataDisplay />
            </Box>
          </Grid>

          {/* Right Column - Production Steps with proper scrolling */}
          <Grid item xs={12} lg={7} sx={{ height: '100%', overflow: 'hidden' }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              {/* Start Production Button - Fixed at top */}
              {!productionStarted && (
                <Alert severity="" sx={{ mb: 3, flexShrink: 0 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* <Typography>Ready to start production? This will update the batch status to 'start-processing'.</Typography> */}
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

              {/* Production Steps - Scrollable area */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  flex: 1, // Take remaining space
                  overflow: 'auto', // Enable scrolling
                  minHeight: 0 // Important for flex scrolling
                }}
              >
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const isCompleted = status === 'completed';
                    const isActive = status === 'active';

                    // Get completion data from database if available
                    const completionData = selectedBatch.currentSteps?.find(
                      dbStep => dbStep.stepNumber === index + 1 && dbStep.completed
                    ) || completedSteps.find(cs => cs.stepNumber === index + 1);

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
                          {/* Step Parameters - Fixed, no scroll */}
                          <Box display="flex" gap={2} mb={2} flexWrap="wrap" justifyContent="center" sx={{ pr: 1 }}>
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

                          {/* Scrollable step content */}
                          <Box sx={{ 
                            maxHeight: 300, 
                            overflow: 'auto',
                            pr: 1 
                          }}>
                            <Card variant="outlined" sx={{ mt: 1, mb: 2 }}>
                              <CardContent>
                                {/* Step Instructions */}
                                <Typography variant="body1" mb={2} sx={{ fontStyle: 'italic' }}>
                                  "{step.instructions}"
                                </Typography>

                                {/* Action Buttons */}
                                {isActive && productionStarted && (
                                  <Box display="flex" gap={2} mt={2} justifyContent="center">
                                    <Button 
                                      variant="contained"
                                      onClick={handleCompleteStep}
                                      startIcon={<CheckCircle />}
                                      color="success"
                                      disabled={loading}
                                    >
                                      Complete Step
                                    </Button>
                                  </Box>
                                )}

                                {/* Completed Step Info - show data from database */}
                                {isCompleted && completionData && (
                                  <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                                    <Typography variant="body2" color="success.dark">
                                      ✓ Completed {completionData.completedAt && `at ${new Date(completionData.completedAt).toLocaleTimeString()}`}
                                    </Typography>
                                    {completionData.actualDuration && (
                                      <Typography variant="body2" color="success.dark">
                                        Actual duration: {formatDuration(completionData.actualDuration)} 
                                        {step.duration !== completionData.actualDuration && (
                                          <span> (Expected: {formatDuration(step.duration)})</span>
                                        )}
                                      </Typography>
                                    )}
                                    {completionData.notes && (
                                      <Typography variant="body2" color="success.dark" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        Notes: {completionData.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Box>
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
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Confirm Step Completion Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm Step Completion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            Are you ready to mark this step as complete? This will be saved to the database.
          </Typography>
          <Typography variant="h6" mb={2} color="primary">
            Step {steps[activeStep]?.number}: {steps[activeStep]?.name}
          </Typography>
          <Typography variant="body2" mb={2} color="textSecondary">
            Expected duration: {formatDuration(steps[activeStep]?.duration)} | Temperature: {steps[activeStep]?.temperature}°C
          </Typography>
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
            {loading ? 'Saving...' : 'Complete Step'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductionSteps;