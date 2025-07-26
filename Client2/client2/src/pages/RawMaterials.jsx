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

export default function RawMaterials() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    axios.get('/api/raw-materials')
      .then(res => setMaterials(res.data))
      .catch(err => console.error('Failed to fetch raw materials:', err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Raw Materials
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Min Threshold</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((mat) => (
              <TableRow key={mat.id}>
                <TableCell>{mat.id}</TableCell>
                <TableCell>{mat.name}</TableCell>
                <TableCell>{mat.quantity}</TableCell>
                <TableCell>{mat.unit}</TableCell>
                <TableCell>{mat.minThreshold}</TableCell>
                <TableCell>
                  {mat.quantity < mat.minThreshold ? (
                    <Chip label="Low Stock" color="error" />
                  ) : (
                    <Chip label="OK" color="success" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
