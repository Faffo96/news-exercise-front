// store.ts
import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import subcategoriesReducer from './subcategoriesSlice';
import mainCategoriesReducer from './mainCategoriesSlice';



export const store = configureStore({
    reducer: {
        news: newsReducer,
        subcategories: subcategoriesReducer,
        mainCategories: mainCategoriesReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
