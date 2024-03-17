import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    curTheme : "dark"
}

export const themeSlice = createSlice({
    name : "theme",
    initialState,
    reducers : {
        toggleDarkTheme : state => {
            state.curTheme = state.curTheme === "dark" ? "light" : "dark";
        }
    }
})

export const { toggleDarkTheme } = themeSlice.actions;
export default themeSlice.reducer;