import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { myHttpService } from '../lib/httpService';

// Definizione del tipo di stato
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

// Stato iniziale
const initialState: SubcategoriesState = {
    subcategories: [],
    loading: false,
    error: null,
};

// Funzione asincrona per ottenere le subcategorie
export const fetchSubcategories = createAsyncThunk(
    'subcategories/fetchSubcategories',
    async (sortBy: string) => {
        const response = await myHttpService.get(`/api/subcategories?sortBy=${sortBy}`);
        return response.data;
    }
);

// Creazione del slice
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
