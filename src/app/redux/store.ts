// store.ts
import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice';
import subcategoriesReducer from './subcategoriesSlice';
import mainCategoriesReducer from './mainCategoriesSlice';
import { useDispatch, useSelector, useStore } from 'react-redux';



export const store = configureStore({
    reducer: {
        news: newsReducer,
        subcategories: subcategoriesReducer,
        mainCategories: mainCategoriesReducer,
    }
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()