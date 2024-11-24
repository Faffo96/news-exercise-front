// src/app/redux/mainCategoriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { myHttpService } from '../lib/httpService';

interface MainCategoriesState {
    mainCategories: string[];
    status: 'loading' | 'succeeded' | 'failed';
}

const initialState: MainCategoriesState = {
    mainCategories: [],
    status: 'loading',
};

export const fetchMainCategories = createAsyncThunk(
    'mainCategories/fetchMainCategories',
    async () => {
        const response = await myHttpService.get('/api/subcategories/mainCategories');
        return response.data;
    }
);

const mainCategoriesSlice = createSlice({
    name: 'mainCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMainCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.mainCategories = action.payload;
            })
            .addCase(fetchMainCategories.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default mainCategoriesSlice.reducer;
