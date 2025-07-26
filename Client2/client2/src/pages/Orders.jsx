import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip
} from '@mui/material';
import axios from 'axios';

const stageColors = {
  due: 'default',
  processing: 'warning',
  packaging: 'info',
  done: 'success',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Finished At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.Product?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={order.stage}
                    color={stageColors[order.stage] || 'default'}
                  />
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {order.finishedAt
                    ? new Date(order.finishedAt).toLocaleString()
                    : 'In Progress'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
