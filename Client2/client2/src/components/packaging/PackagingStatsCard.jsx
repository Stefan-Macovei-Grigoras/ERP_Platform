// components/packaging/PackagingStatsCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  CheckCircle,
  Schedule,
  Person
} from '@mui/icons-material';

function PackagingStatsCard({ title, value, subtitle, trend, color = 'primary', icon, progress }) {
  const getIcon = () => {
    switch (icon) {
      case 'assignment':
        return <Assignment />;
      case 'check':
        return <CheckCircle />;
      case 'schedule':
        return <Schedule />;
      case 'person':
        return <Person />;
      default:
        return <Assignment />;
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp fontSize="small" color="success" />;
    if (trend < 0) return <TrendingDown fontSize="small" color="error" />;
    return null;
  };

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {getIcon()}
          </Box>
        </Box>

        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="textSecondary">
              {progress}% Complete
            </Typography>
          </Box>
        )}

        {trend !== undefined && (
          <Box display="flex" alignItems="center" gap={1}>
            {getTrendIcon()}
            <Typography variant="caption" color="textSecondary">
              {Math.abs(trend)}% from yesterday
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PackagingStatsCard;