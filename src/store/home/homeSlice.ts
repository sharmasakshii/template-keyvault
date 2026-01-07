import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HomeInterface } from "./homeInterface";


export const initialState: HomeInterface = {
    isLoading: false,
}

export const setLoading = createAsyncThunk("HeaderName", async (status: boolean) => {
    return status
})

export const homeReducer = createSlice({
    name: "home",
    initialState,
    reducers: {
        resetHome: (state) => {
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(setLoading.fulfilled, (state: any, action: any) => {
                state.isLoading = action.payload;
            })


    }
})

export const { resetHome } = homeReducer.actions;
export default homeReducer.reducer;