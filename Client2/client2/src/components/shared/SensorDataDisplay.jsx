// import React, { useState, useEffect, useRef } from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from 'recharts';

// function SensorDataDisplay() {
//   const [sensorData, setSensorData] = useState({
//     temperature: null,
//     timestamp: null
//   });
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [chartData, setChartData] = useState([]);
//   const [error, setError] = useState(null);
//   const wsRef = useRef(null);

//   // WebSocket connection
//   useEffect(() => {
//     const connectWebSocket = () => {
//       try {
//         const ws = new WebSocket('ws://localhost:5000/ws');
//         wsRef.current = ws;

//         ws.onopen = () => {
//           console.log('Connected to sensor WebSocket');
//           setConnectionStatus('connected');
//           setError(null);
//         };

//         ws.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
            
//             if (data.temperature !== undefined) {
//               const timestamp = new Date();
//               const newSensorData = {
//                 temperature: parseFloat(data.temperature),
//                 timestamp: timestamp
//               };

//               setSensorData(newSensorData);

//               // Add to chart data (keep last 20 readings for better trend visibility)
//               setChartData(prevData => {
//                 const newDataPoint = {
//                   time: timestamp.toLocaleTimeString().slice(0, 5), // HH:MM format
//                   temperature: newSensorData.temperature,
//                   timestamp: timestamp.getTime()
//                 };

//                 const updatedData = [...prevData, newDataPoint];
//                 return updatedData.slice(-20); // Keep only last 20 points
//               });
//             }
//           } catch (err) {
//             console.error('Error parsing sensor data:', err);
//           }
//         };

//         ws.onclose = () => {
//           console.log('Disconnected from sensor WebSocket');
//           setConnectionStatus('disconnected');
          
//           // Attempt to reconnect after 5 seconds
//           setTimeout(connectWebSocket, 5000);
//         };

//         ws.onerror = (error) => {
//           console.error('WebSocket error:', error);
//           setError('WebSocket connection error');
//           setConnectionStatus('error');
//         };

//       } catch (err) {
//         console.error('Failed to connect to WebSocket:', err);
//         setError('Failed to connect to sensor server');
//         setConnectionStatus('error');
//       }
//     };

//     connectWebSocket();

//     // Cleanup on unmount
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, []);

//   const getConnectionStatusColor = () => {
//     switch (connectionStatus) {
//       case 'connected': return '#4caf50';
//       case 'disconnected': return '#ff9800';
//       case 'error': return '#f44336';
//       default: return '#9e9e9e';
//     }
//   };

//   // Custom legend component
//   const CustomLegend = () => (
//     <div style={{ 
//       display: 'flex', 
//       justifyContent: 'center', 
//       alignItems: 'center',
//       gap: '8px',
//       marginBottom: '8px',
//       fontSize: '12px',
//       color: '#666'
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//         <div style={{ 
//           width: '12px', 
//           height: '2px', 
//           backgroundColor: '#f44336',
//           borderRadius: '1px'
//         }}></div>
//         <span>Temperature (°C)</span>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ 
//       backgroundColor: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//       overflow: 'hidden'
//     }}>
//       {/* Header */}
//       <div style={{ 
//         padding: '16px',
//         borderBottom: '1px solid #e0e0e0',
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center'
//       }}>
//         <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
//           Cauldron Temperature
//         </h3>
//         <div style={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: '6px',
//           padding: '4px 8px',
//           borderRadius: '12px',
//           backgroundColor: getConnectionStatusColor(),
//           color: 'white',
//           fontSize: '0.75rem',
//           fontWeight: '500'
//         }}>
//           <span style={{ fontSize: '0.8rem' }}>
//             {connectionStatus === 'connected' ? '●' : '○'}
//           </span>
//           {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
//         </div>
//       </div>

//       {error && (
//         <div style={{ 
//           padding: '12px 16px', 
//           backgroundColor: '#ffebee', 
//           borderLeft: '3px solid #f44336',
//           color: '#c62828',
//           fontSize: '0.875rem',
//           fontWeight: '500'
//         }}>
//           {error}
//         </div>
//       )}

//       {/* Current Temperature Display */}
//       <div style={{ padding: '10px' }}>
//         <div style={{ 
//           textAlign: 'center',
//           padding: '20px',
//           backgroundColor: '#f8f9fa',
//           borderRadius: '12px',
//           border: '2px solid #ddd',
//           marginBottom: '20px'
//         }}>
//           <div style={{ 
//             fontSize: '0.875rem', 
//             color: '#666', 
//             marginBottom: '8px',
//             fontWeight: '500'
//           }}>
//             Cauldron Temperature
//           </div>
//           <div style={{ 
//             fontSize: '3rem', 
//             fontWeight: 'bold', 
//             color: '#333',
//             lineHeight: '1',
//             marginBottom: '8px'
//           }}>
//             {sensorData.temperature !== null ? `${sensorData.temperature.toFixed(1)}°C` : '--°C'}
//           </div>
//         </div>

//         {/* Last Update Time */}
//         {sensorData.timestamp && (
//           <div style={{ 
//             textAlign: 'center', 
//             fontSize: '0.8rem', 
//             color: '#666',
//             marginBottom: '20px',
//             backgroundColor: '#f0f0f0',
//             padding: '8px',
//             borderRadius: '6px'
//           }}>
//             Last updated: {sensorData.timestamp.toLocaleTimeString()}
//           </div>
//         )}

//         {/* Temperature Trend Chart */}
//         <div style={{ 
//           backgroundColor: '#fafafa',
//           borderRadius: '8px',
//           padding: '8px'
//         }}>
//           <div style={{ 
//             fontSize: '1rem', 
//             fontWeight: '600', 
//             marginBottom: '12px', 
//             color: '#333',
//             textAlign: 'center'
//           }}>
//             Temperature Trend (Last 20 Readings)
//           </div>
          
//           {chartData.length > 0 ? (
//             <div style={{ height: '250px' }}>
//               <CustomLegend />
//               <ResponsiveContainer width="100%" height="90%">
//                 <LineChart 
//                   data={chartData} 
//                   margin={{ top: 7, right: 10, left: 3, bottom: 0 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                   <XAxis 
//                     dataKey="time" 
//                     tick={{ fontSize: 11, fill: '#666' }}
//                     axisLine={{ stroke: '#ddd' }}
//                     tickLine={{ stroke: '#ddd' }}
//                     interval="preserveStartEnd"
//                   />
//                   <YAxis 
//                     tick={{ fontSize: 11, fill: '#666' }}
//                     axisLine={{ stroke: '#ddd' }}
//                     tickLine={{ stroke: '#ddd' }}
//                     domain={['dataMin - 2', 'dataMax + 2']}
//                     width={25}
//                   />
//                   <Tooltip
//                     labelStyle={{ fontSize: '12px', fontWeight: '500' }}
//                     contentStyle={{ 
//                       fontSize: '12px',
//                       padding: '8px 12px',
//                       border: '1px solid #ddd',
//                       borderRadius: '6px',
//                       backgroundColor: 'rgba(255,255,255,0.95)',
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                     }}
//                     formatter={(value, name) => [
//                       `${parseFloat(value).toFixed(1)}°C`,
//                       'Temperature'
//                     ]}
//                     labelFormatter={(label) => `Time: ${label}`}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="temperature"
//                     stroke="#666"
//                     strokeWidth={2}
//                     dot={{ fill: '#666', strokeWidth: 1, r: 2 }}
//                     activeDot={{ r: 3, stroke: '#666', strokeWidth: 1, fill: '#fff' }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center', 
//               height: '270px',
//               color: '#999',
//               fontSize: '0.875rem',
//               backgroundColor: '#f5f5f5',
//               borderRadius: '6px',
//               border: '2px dashed #ddd'
//             }}>
//               Waiting for temperature data...
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SensorDataDisplay;

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

function SensorDataDisplay() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
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
        const ws = new WebSocket('ws://localhost:5000/ws');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to sensor WebSocket');
          setConnectionStatus('connected');
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.temperature !== undefined) {
              const timestamp = new Date();
              const newSensorData = {
                temperature: parseFloat(data.temperature),
                timestamp: timestamp
              };

              setSensorData(newSensorData);

              // Add to chart data (keep last 20 readings for better trend visibility)
              setChartData(prevData => {
                const newDataPoint = {
                  time: timestamp.toLocaleTimeString().slice(0, 5), // HH:MM format
                  temperature: newSensorData.temperature,
                  timestamp: timestamp.getTime()
                };

                const updatedData = [...prevData, newDataPoint];
                return updatedData.slice(-20); // Keep only last 20 points
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

  // Custom legend component
  const CustomLegend = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '12px',
      color: '#666'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ 
          width: '12px', 
          height: '2px', 
          backgroundColor: '#f44336',
          borderRadius: '1px'
        }}></div>
        <span>Temperature (°C)</span>
      </div>
    </div>
  );

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
          Cauldron Temperature
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '12px',
          backgroundColor: getConnectionStatusColor(),
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: '500'
        }}>
          <span style={{ fontSize: '0.8rem' }}>
            {connectionStatus === 'connected' ? '●' : '○'}
          </span>
          {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#ffebee', 
          borderLeft: '3px solid #f44336',
          color: '#c62828',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      {/* Current Temperature Display - Made Smaller */}
      <div style={{ padding: '10px' }}>
        <div style={{ 
          textAlign: 'center',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '16px'
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#666', 
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Current Temperature
          </div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#333',
            lineHeight: '1',
            marginBottom: '4px'
          }}>
            {sensorData.temperature !== null ? `${sensorData.temperature.toFixed(1)}°C` : '--°C'}
          </div>
        </div>

        {/* Last Update Time */}
        {sensorData.timestamp && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '0.75rem', 
            color: '#666',
            marginBottom: '16px',
            backgroundColor: '#f0f0f0',
            padding: '6px',
            borderRadius: '4px'
          }}>
            Last updated: {sensorData.timestamp.toLocaleTimeString()}
          </div>
        )}

        {/* Temperature Trend Chart */}
        <div style={{ 
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          padding: '8px'
        }}>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '12px', 
            color: '#333',
            textAlign: 'center'
          }}>
            Temperature Trend (Last 20 Readings)
          </div>
          
          {chartData.length > 0 ? (
            <div style={{ height: '250px' }}>
              <CustomLegend />
              <ResponsiveContainer width="100%" height="90%">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 7, right: 10, left: 3, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={{ stroke: '#ddd' }}
                    tickLine={{ stroke: '#ddd' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    axisLine={{ stroke: '#ddd' }}
                    tickLine={{ stroke: '#ddd' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                    width={25}
                  />
                  <Tooltip
                    labelStyle={{ fontSize: '12px', fontWeight: '500' }}
                    contentStyle={{ 
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [
                      `${parseFloat(value).toFixed(1)}°C`,
                      'Temperature'
                    ]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#666"
                    strokeWidth={2}
                    dot={{ fill: '#666', strokeWidth: 1, r: 2 }}
                    activeDot={{ r: 3, stroke: '#666', strokeWidth: 1, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '270px',
              color: '#999',
              fontSize: '0.875rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              border: '2px dashed #ddd'
            }}>
              Waiting for temperature data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SensorDataDisplay;