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
  Stop,
  Timer,
  Thermostat,
  ArrowBack,
  Done
} from '@mui/icons-material';

function ProductionSteps({ selectedProduct, onBackToSelection, onProductionComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStepStartTime, setCurrentStepStartTime] = useState(null);
  const [stepTimers, setStepTimers] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [stepNotes, setStepNotes] = useState('');
  const [productionStarted, setProductionStarted] = useState(false);

  const steps = selectedProduct?.steps?.steps || [];

  // Calculate total progress
  const progress = (completedSteps.length / steps.length) * 100;

  // Start production
  const handleStartProduction = () => {
    setProductionStarted(true);
    setCurrentStepStartTime(new Date());
  };

  // Complete current step
  const handleCompleteStep = () => {
    setConfirmDialog(true);
  };

  // Confirm step completion
  const handleConfirmStepCompletion = () => {
    const stepEndTime = new Date();
    const stepDuration = currentStepStartTime 
      ? Math.round((stepEndTime - currentStepStartTime) / 60000) // minutes
      : steps[activeStep]?.duration || 0;

    // Add to completed steps
    setCompletedSteps(prev => [...prev, {
      stepNumber: activeStep + 1,
      stepId: steps[activeStep]?.number,
      stepName: steps[activeStep]?.name,
      completedAt: stepEndTime,
      actualDuration: stepDuration,
      notes: stepNotes
    }]);

    // Update timers
    setStepTimers(prev => ({
      ...prev,
      [activeStep]: stepDuration
    }));

    // Move to next step or complete production
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setCurrentStepStartTime(new Date());
    } else {
      // Production complete
      handleProductionComplete();
    }

    // Reset dialog
    setConfirmDialog(false);
    setStepNotes('');
  };

  // Complete entire production
  const handleProductionComplete = () => {
    const productionData = {
      productId: selectedProduct.productId,
      recipeId: selectedProduct.id,
      completedSteps: completedSteps,
      totalDuration: Object.values(stepTimers).reduce((sum, time) => sum + time, 0),
      yield: selectedProduct.yield,
      completedAt: new Date()
    };

    console.log('Production completed:', productionData);
    onProductionComplete(productionData);
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
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
          >
            Back to Selection
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Production: {selectedProduct?.Product?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Recipe: {selectedProduct?.name} | Yield: {selectedProduct?.yield}kg
          </Typography>
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
        </Box>
      </Box>

      {/* Start Production Button */}
      {!productionStarted && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Ready to start production? Click the button to begin.</Typography>
            <Button 
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleStartProduction}
              sx={{ ml: 2 }}
            >
              Start Production
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
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">
                      {step.name}
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
                      {/* Step Details */}
                      <Typography variant="body1" mb={2}>
                        {step.instructions}
                      </Typography>

                      {/* Step Parameters */}
                      <Box display="flex" gap={2} mb={2}>
                        <Chip 
                          label={`${formatDuration(step.duration)}`}
                          icon={<Timer />}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={`${step.temperature}°C`}
                          icon={<Thermostat />}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </Box>

                      {/* Action Buttons */}
                      {isActive && productionStarted && (
                        <Box display="flex" gap={2} mt={2}>
                          <Button 
                            variant="contained"
                            onClick={handleCompleteStep}
                            startIcon={<CheckCircle />}
                            color="success"
                          >
                            Complete Step
                          </Button>
                          <Button 
                            variant="outlined"
                            startIcon={<Pause />}
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
        {completedSteps.length === steps.length && (
          <Box mt={4} p={3} bgcolor="success.light" borderRadius={2} textAlign="center">
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="success.dark" fontWeight="bold" mb={1}>
              Production Complete!
            </Typography>
            <Typography variant="body1" color="success.dark" mb={2}>
              All {steps.length} steps have been completed successfully.
            </Typography>
            <Button 
              variant="contained"
              color="success"
              size="large"
              onClick={onBackToSelection}
            >
              Return to Product Selection
            </Button>
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
          <Typography variant="h6" mb={2}>
            {steps[activeStep]?.name}
          </Typography>
          <TextField
            label="Notes (optional)"
            multiline
            rows={3}
            fullWidth
            value={stepNotes}
            onChange={(e) => setStepNotes(e.target.value)}
            placeholder="Add any notes about this step..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmStepCompletion}
            variant="contained"
            color="success"
          >
            Complete Step
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductionSteps;

