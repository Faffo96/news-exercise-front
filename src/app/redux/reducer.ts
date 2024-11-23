/* import {
    SET_SELECTED_MAIN_CATEGORY,
    SET_SELECTED_SUBCATEGORIES,
    SET_SELECTED_OTHER_CATEGORIES
} from './actions';

interface NewsState {
    selectedMainCategory: string;
    selectedSubcategories: number[];
    selectedOtherCategories: string[];
}

const initialState: NewsState = {
    selectedMainCategory: "",
    selectedSubcategories: [],
    selectedOtherCategories: []
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newsReducer = (state = initialState, action: any): NewsState => {
    switch (action.type) {
        case SET_SELECTED_MAIN_CATEGORY:
            return {
                ...state,
                selectedMainCategory: action.payload
            };
        case SET_SELECTED_SUBCATEGORIES:
            return {
                ...state,
                selectedSubcategories: action.payload
            };
        case SET_SELECTED_OTHER_CATEGORIES:
            return {
                ...state,
                selectedOtherCategories: action.payload
            };
        default:
            return state;
    }
};

export default newsReducer;
 */