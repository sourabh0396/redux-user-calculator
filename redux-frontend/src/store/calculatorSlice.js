import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  history: [],
  totalLogs: 0,
  error: null,
  status: 'idle',
};

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token'); // Adjust if you use a different storage mechanism

// Async thunk for fetching logs
export const fetchUserLogs = createAsyncThunk(
  'calculator/fetchUserLogs',
  async () => {
    const token = getAuthToken();
    const response = await axios.get('http://localhost:5000/calculations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Async thunk for adding a result
export const addResult = createAsyncThunk(
  'calculator/addResult',
  async (result) => {
    const token = getAuthToken();
    const response = await axios.post('http://localhost:5000/calculations', result, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Async thunk for deleting logs
// export const deleteLogs = createAsyncThunk(
//   'calculator/deleteLogs',
//   async (ids) => {
//     const token = getAuthToken();
//     // await axios.delete('http://localhost:4000/calculations/logs', {
//       await axios.delete('http://localhost:5000/calculations', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: { ids },
//     });
//     return ids;
//   }
// );
export const deleteLogs = createAsyncThunk(
  'calculator/deleteLogs',
  async (ids) => {
    const token = getAuthToken();
    await axios.delete('http://localhost:5000/calculations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ids },
    });
    return ids; // return ids to update the state accordingly
  }
);

// Create slice
const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload.logs;
        state.totalLogs = action.payload.totalLogs;
      })
      .addCase(fetchUserLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addResult.fulfilled, (state, action) => {
        // Optionally handle the result addition (e.g., update state.history)
        state.history.push(action.payload);
      })
      // .addCase(deleteLogs.fulfilled, (state, action) => {
      //   state.history = state.history.filter(log => !action.payload.includes(log.id));
      // });

      .addCase(deleteLogs.fulfilled, (state, action) => {
        state.history = state.history.filter(log => !action.payload.includes(log._id));
      });
      
  },
});

export default calculatorSlice.reducer;
