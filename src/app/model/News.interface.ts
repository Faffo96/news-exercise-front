// src/types/index.ts

import { Subcategory } from "./Subcategory.interface";

export interface News {
    id?: string;
    title: string;
    body: string;
    author: string;
    releaseDate: string;
    archiveDate: string;
    mainCategory: string;
    otherCategoriesList: string;
    subcategoriesList: Subcategory[] | number[];
}
