import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material';

function StatsCard({ 
  title, 
  value, 
  color = '#1976d2', 
  change, 
  icon,
  loading = false,
  trend = 'neutral' // 'up', 'down', 'neutral'
}) {
  
  // Get trend icon and color
  const getTrendDisplay = () => {
    switch(trend) {
      case 'up':
        return { icon: <TrendingUp />, color: '#2e7d32' };
      case 'down':
        return { icon: <TrendingDown />, color: '#d32f2f' };
      default:
        return { icon: <Remove />, color: '#757575' };
    }
  };

  const trendDisplay = getTrendDisplay();

  // Loading skeleton
  if (loading) {
    return (
      <Card elevation={2} sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            {/* Card title */}
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            
            {/* Main value */}
            <Typography 
              variant="h4" 
              component="div" 
              fontWeight="bold"
              sx={{ 
                color: color,
                mb: 1,
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
            
            {/* Change indicator */}
            {change && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <Box 
                  sx={{ 
                    color: trendDisplay.color,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {React.cloneElement(trendDisplay.icon, { fontSize: 'small' })}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'textSecondary',
                    fontSize: '0.8rem'
                  }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Icon avatar */}
          <Avatar 
            sx={{ 
              bgcolor: color + '20',
              color: color,
              width: 56, 
              height: 56,
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem'
              }
            }}
          >
            {icon || <TrendingUp />}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsCard;