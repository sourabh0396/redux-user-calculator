// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Login user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/signIn', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Register user
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        user: null,
        status: null,
        error: null,
    },
    reducers: {
        // Logout action
        // logout: (state) => {
        //     state.token = null;
        //     state.user = null;
        //     localStorage.removeItem('token');
        //     state.status = 'logged_out';
        //     state.error = null;
        // },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token'); // Remove token from localStorage
            state.status = 'logged_out';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.token);
                state.status = 'logged_in';

                // Apply the colors dynamically after login
                document.documentElement.style.setProperty('--primary-color', action.payload.user.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', action.payload.user.secondaryColor);
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'registered';
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload; // Use payload for error message
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload; // Use payload for error message
            });
    },
});

// Export the logout action
export const { logout } = authSlice.actions;

export default authSlice.reducer;
// // src/store/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Login user
// export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
//     const response = await axios.post('http://localhost:5000/auth/signIn', credentials);
//     return response.data;
// });

// // Register user
// export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
//     const response = await axios.post('http://localhost:5000/auth/register', userData);
//     return response.data;
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         token: localStorage.getItem('token') || null,
//         user: null,
//         status: null,
//         error: null,
//     },
//     reducers: {
//         // Logout action
//         logout: (state) => {
//             state.token = null;
//             state.user = null;
//             localStorage.removeItem('token');
//             state.status = 'logged_out';
//             state.error = null;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.token = action.payload.token;
//                 state.user = action.payload.user;
//                 localStorage.setItem('token', action.payload.token);
//                 state.status = 'logged_in';

//                 // Apply the colors dynamically after login
//                 document.documentElement.style.setProperty('--primary-color', action.payload.user.primaryColor);
//                 document.documentElement.style.setProperty('--secondary-color', action.payload.user.secondaryColor);
//             })
//             .addCase(registerUser.fulfilled, (state) => {
//                 state.status = 'registered';
//                 state.error = null;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.error = action.error.message;
//             })
//             .addCase(registerUser.rejected, (state, action) => {
//                 state.error = action.error.message;
//             });
//     },
// });

// // Export the logout action
// export const { logout } = authSlice.actions;

// export default authSlice.reducer;

// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import axios from 'axios';

// // const token = localStorage.getItem('token');

// // export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
// //   const response = await axios.post('http://localhost:5000/auth/signIn', credentials);
// //   return response.data;
// // });

// // export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
// //   const response = await axios.post('http://localhost:5000/auth/register', userData);
// //   return response.data;
// // });

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: {
// //     token: token ? token : null,
// //     user: null,  // Add user to state
// //     status: null,
// //     error: null,
// //   },
// //   reducers: {
// //     // Add logout reducer
// //     logout: (state) => {
// //       state.token = null;
// //       state.user = null; // Clear user on logout
// //       localStorage.removeItem('token'); // Clear token from localStorage
// //       state.status = 'logged_out';
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(loginUser.fulfilled, (state, action) => {
// //         state.token = action.payload.token;
// //         state.user = action.payload.user; // Store user details in state
// //         localStorage.setItem('token', action.payload.token);
// //         state.status = 'logged_in';
// //         state.error = null; // Clear error on successful login
// //       })
// //       .addCase(registerUser.fulfilled, (state) => {
// //         state.status = 'registered';
// //         state.error = null; // Clear error on successful registration
// //       })
// //       .addCase(loginUser.rejected, (state, action) => {
// //         state.error = action.error.message;
// //       })
// //       .addCase(registerUser.rejected, (state, action) => {
// //         state.error = action.error.message;
// //       });
// //   },
// // });

// // // Export the logout action
// // export const { logout } = authSlice.actions;

// // export default authSlice.reducer;
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // import axios from 'axios';

// // const token = localStorage.getItem('token');

// // export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
// // //   const response = await axios.post('http://localhost:5000/api/signin', credentials);
// //   const response = await axios.post('http://localhost:5000/auth/login', credentials);
// //   return response.data;
// // });

// // export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
// // //   const response = await axios.post('http://localhost:5000/api/register', userData);
// // const response = await axios.post('http://localhost:5000/auth/register', userData);
// //   return response.data;
// // });

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: {
// //     token: token ? token : null,
// //     status: null,
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(loginUser.fulfilled, (state, action) => {
// //         state.token = action.payload.token;
// //         localStorage.setItem('token', action.payload.token);
// //         state.status = 'logged_in';
// //         state.error = null; // Clear error on successful login
// //       })
// //       .addCase(registerUser.fulfilled, (state) => {
// //         state.status = 'registered';
// //         state.error = null; // Clear error on successful registration
// //       })
// //       .addCase(loginUser.rejected, (state, action) => {
// //         state.error = action.error.message;
// //       })
// //       .addCase(registerUser.rejected, (state, action) => {
// //         state.error = action.error.message;
// //       });
// //   },
// // });

// // export default authSlice.reducer;
