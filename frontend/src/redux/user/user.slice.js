import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null, 
    loading : false,
    error : null 
}


export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.user = action.payload
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        signOutSuccess : (state) => {
            state.user = null
            state.loading = false
            state.error = false
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, signOutSuccess } = userSlice.actions;
export default userSlice.reducer;

