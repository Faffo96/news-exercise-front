import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subcategory } from '../model/Subcategory.interface';

interface NewsState {
    mainCategory: string;
    otherCategoriesList: string[];
    subcategoriesList: Subcategory[];
}

const initialState: NewsState = {
    mainCategory: "",
    otherCategoriesList: [],
    subcategoriesList: [],
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setMainCategory: (state, action: PayloadAction<string>) => {
            state.mainCategory = action.payload;
        },
        setOtherCategoriesList: (state, action: PayloadAction<string[]>) => {
            state.otherCategoriesList = action.payload;
        },
        setSubcategoriesList: (state, action: PayloadAction<Subcategory[]>) => {
            state.subcategoriesList = action.payload;
        },
    },
});

export const { setMainCategory, setOtherCategoriesList, setSubcategoriesList } = newsSlice.actions;
export default newsSlice.reducer;
