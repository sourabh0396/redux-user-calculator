
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch user profile
export const fetchUserProfile = createAsyncThunk('profile/fetchUserProfile', async () => {
    const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
});

// Update user profile
export const updateUserProfile = createAsyncThunk('profile/updateUserProfile', async (profileData) => {
    const response = await axios.put('http://localhost:5000/profile', profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        userData: null,
        status: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.status = 'profile_fetched';

                // Apply the primary and secondary colors dynamically
                document.documentElement.style.setProperty('--primary-color', action.payload.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', action.payload.secondaryColor);
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.status = 'profile_updated';

                // Update the colors dynamically after profile update
                document.documentElement.style.setProperty('--primary-color', action.payload.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', action.payload.secondaryColor);
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default profileSlice.reducer;
