import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { myHttpService } from '../lib/httpService';

interface Subcategory {
    id?: number;
    mainCategory?: string;
    subcategory?: string;
}

interface SubcategoriesState {
    subcategories: Subcategory[];
    loading: boolean;
    error: string | null;
}

const initialState: SubcategoriesState = {
    subcategories: [],
    loading: false,
    error: null,
};

export const fetchSubcategories = createAsyncThunk(
    'subcategories/fetchSubcategories',
    async (sortBy: string) => {
        const response = await myHttpService.get(`/api/subcategories?sortBy=${sortBy}`);
        return response.data;
    }
);

const subcategoriesSlice = createSlice({
    name: 'subcategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubcategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load subcategories';
            });
    },
});

export default subcategoriesSlice.reducer;
