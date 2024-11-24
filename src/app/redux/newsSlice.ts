import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { myHttpService } from '@/app/lib/httpService';
import { News } from '@/app/model/News.interface';

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
    const response = await myHttpService.get('/api/news');
    return response.data;
});
export const createNews = createAsyncThunk('news/createNews', async (news: News) => {
    const response = await myHttpService.post('/api/news', news);
    return response.data;
});

export const updateNews = createAsyncThunk('news/updateNews', async (news: News) => {
    const response = await myHttpService.put(`/api/news/${news.id}`, news);
    return response.data;
});

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        newsList: [] as News[],
        filteredNews: [] as News[], // Lista filtrata
        selectedMainCategory: '', // Categoria principale selezionata
        selectedSubcategories: [] as string[], // Sottocategorie selezionate
        selectedOtherCategories: [] as string[], // Altre categorie selezionate
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null as string | null,
    },
    reducers: {
        setSelectedMainCategory: (state, action) => {
            state.selectedMainCategory = action.payload;
        },
        setSelectedSubcategories: (state, action) => {
            state.selectedSubcategories = action.payload;
        },
        setSelectedOtherCategories: (state, action) => {
            state.selectedOtherCategories = action.payload;
        },
        filterNews: (state) => {
            // Funzione di filtro basata sui parametri selezionati
            state.filteredNews = state.newsList.filter(news => {
                const matchesMainCategory = state.selectedMainCategory
                    ? news.mainCategory === state.selectedMainCategory
                    : true;
                
                // Confronto delle sottocategorie
                const matchesSubcategories = state.selectedSubcategories.length
                    ? state.selectedSubcategories.every((subcat) => 
                        news.subcategoriesList.some(sub => sub.subcategory === subcat) // Controlla la proprietà 'subcategory' per ogni sottocategoria
                    )
                    : true;

                // Confronto per altre categorie
                const matchesOtherCategories = state.selectedOtherCategories.length
                    ? state.selectedOtherCategories.some(other => news.otherCategoriesList.includes(other))
                    : true;

                return matchesMainCategory && matchesSubcategories && matchesOtherCategories;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.newsList = action.payload;
                state.filteredNews = action.payload; // Filtra immediatamente dopo il fetch
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(createNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.newsList.push(action.payload);
                state.filteredNews.push(action.payload);
            })
            .addCase(createNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(updateNews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNews.fulfilled, (state, action) => {
                state.status = 'succeeded';
            
                // Aggiorna newsList con un nuovo riferimento
                state.newsList = state.newsList.map(news =>
                    news.id === action.payload.id ? action.payload : news
                );
            
                // Aggiorna filteredNews con un nuovo riferimento, nel caso in cui venga utilizzato per la visualizzazione filtrata
                state.filteredNews = state.filteredNews.map(news =>
                    news.id === action.payload.id ? action.payload : news
                );
            })
            
            .addCase(updateNews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export const { setSelectedMainCategory, setSelectedSubcategories, setSelectedOtherCategories, filterNews } = newsSlice.actions;

export default newsSlice.reducer;
