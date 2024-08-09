'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Grid } from '@mui/material';
import { firestore } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const addItem = async (item, category) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await setDoc(docRef, { category, quantity: 1 });
    await updateInventory();
  };

  const increaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { ...docSnap.data(), quantity: quantity + 1 });
    }
    await updateInventory();
  };

  const decreaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { ...docSnap.data(), quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Add Item</Typography>
          <Stack spacing={2}>
            <TextField label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <TextField label="Category" variant="outlined" fullWidth value={category} onChange={(e) => setCategory(e.target.value)} />
            <Button variant="outlined" onClick={() => { addItem(itemName, category); setItemName(''); setCategory(''); handleClose(); }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border="1px solid #333" width="800px" display="flex" flexDirection="column" alignItems="center">
        <Box bgcolor="#ADD8E6" display="flex" justifyContent="center" alignItems="center" height="100px" width="100%">
          <Typography variant="h2">Inventory Items</Typography>
        </Box>
        <Box width="90%" marginTop={2}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputRef={searchInputRef}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
        </Box>
        <Stack spacing={2} height="300px" overflow="auto" sx={{ margin: 2, width: '90%' }}>
          {filteredInventory.map(({ name, quantity, category }) => (
            <Box key={name} display="flex" justifyContent="space-between" alignItems="center" p={2} width="100%">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="h6">{name}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">{category}</Typography>
                </Grid>
                <Grid item xs={4} display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body1">Quantity: {quantity}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button variant="outlined" onClick={() => decreaseQuantity(name)}>-</Button>
                    <Button variant="outlined" onClick={() => increaseQuantity(name)}>+</Button>
                    <Button variant="contained" onClick={() => decreaseQuantity(name)}>Remove</Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
