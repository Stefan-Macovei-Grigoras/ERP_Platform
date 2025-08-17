import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function SensorDataDisplay() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    timestamp: null
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:5000/ws'); // Updated to localhost
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to sensor WebSocket');
          setConnectionStatus('connected');
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.temperature !== undefined && data.humidity !== undefined) {
              const timestamp = new Date();
              const newSensorData = {
                temperature: parseFloat(data.temperature),
                humidity: parseFloat(data.humidity),
                timestamp: timestamp
              };

              setSensorData(newSensorData);

              // Add to chart data (keep last 15 readings for compact view)
              setChartData(prevData => {
                const newDataPoint = {
                  time: timestamp.toLocaleTimeString().slice(0, 5), // HH:MM format
                  temperature: newSensorData.temperature,
                  humidity: newSensorData.humidity,
                  timestamp: timestamp.getTime()
                };

                const updatedData = [...prevData, newDataPoint];
                return updatedData.slice(-15); // Keep only last 15 points
              });
            }
          } catch (err) {
            console.error('Error parsing sensor data:', err);
          }
        };

        ws.onclose = () => {
          console.log('Disconnected from sensor WebSocket');
          setConnectionStatus('disconnected');
          
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket connection error');
          setConnectionStatus('error');
        };

      } catch (err) {
        console.error('Failed to connect to WebSocket:', err);
        setError('Failed to connect to sensor server');
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4caf50';
      case 'disconnected': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
          Environmental Data
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: getConnectionStatusColor(),
          color: 'white',
          fontSize: '0.75rem'
        }}>
          <span style={{ fontSize: '0.8rem' }}>
            {connectionStatus === 'connected' ? '●' : '○'}
          </span>
          {connectionStatus}
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '8px 16px', 
          backgroundColor: '#ffebee', 
          borderLeft: '3px solid #f44336',
          color: '#c62828',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Current Values - Compact Layout */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {/* Temperature */}
          <div style={{ 
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            border: '1px solid #ffcc02'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#e65100', marginBottom: '4px' }}>
              🌡️ Temperature
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>
              {sensorData.temperature !== null ? `${sensorData.temperature.toFixed(1)}°C` : '--'}
            </div>
          </div>

          {/* Humidity */}
          <div style={{ 
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #2196f3'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#1565c0', marginBottom: '4px' }}>
              💧 Humidity
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1565c0' }}>
              {sensorData.humidity !== null ? `${sensorData.humidity.toFixed(1)}%` : '--'}
            </div>
          </div>
        </div>

        {/* Last Update Time */}
        {sensorData.timestamp && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '0.75rem', 
            color: '#666',
            marginBottom: '16px'
          }}>
            Last updated: {sensorData.timestamp.toLocaleTimeString()}
          </div>
        )}

        {/* Compact Chart */}
        <div style={{ 
          height: '200px',
          backgroundColor: '#fafafa',
          borderRadius: '6px',
          padding: '8px'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px', color: '#666' }}>
            Recent Readings
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  labelStyle={{ fontSize: '12px' }}
                  contentStyle={{ 
                    fontSize: '12px',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  formatter={(value, name) => [
                    `${parseFloat(value).toFixed(1)}${name === 'temperature' ? '°C' : '%'}`,
                    name === 'temperature' ? 'Temp' : 'Humidity'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f44336"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#2196f3"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '85%',
              color: '#999',
              fontSize: '0.875rem'
            }}>
              Waiting for data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SensorDataDisplay;