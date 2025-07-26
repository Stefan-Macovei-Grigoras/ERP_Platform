import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import axios from 'axios';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error('Error fetching recipes:', err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Recipes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Ingredients</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>{recipe.Product?.name || 'N/A'}</TableCell>
                <TableCell>
                  <List dense>
                    {recipe.ingredients?.map((ingredient, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${ingredient.RawMaterial.name} — ${ingredient.quantity} ${ingredient.RawMaterial.unit}`}
                        />
                      </ListItem>
                    )) || 'No ingredients'}
                  </List>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
