"use client";

import "./homeBody.css";
import { myHttpService } from "@/app/lib/httpService";
import { showToast } from "@/app/lib/showToast";
import { News } from "@/app/model/News.interface";
import { useEffect, useState } from "react";
import OverlaySpinner from "../overlaySpinner/overlaySpinner";
import NewsModal from "../modal/newsModal";
import { Subcategory } from "@/app/model/Subcategory.interface";

const HomeBody = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterOption, setFilterOption] = useState<string>("all");
    const [newNews, setNewNews] = useState<News>({ title: '', body: '', author: '', archiveDate: '', releaseDate: '', mainCategory: '', otherCategoriesList: '', subcategoriesList: [] });
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [mainCategories, setMainCategories] = useState<string[]>([]);
    const [mainCategoryFilter, setMainCategoryFilter] = useState<string>("all");
    const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");

    useEffect(() => {

        fetchSubcategories();

    }, []);

    const fetchSubcategories = async () => {
        try {
            const response = await myHttpService.get('/api/subcategories');
            const data: Subcategory[] = response.data;
            setSubcategories(data);
            console.log("data: ", data);

            const uniqueMainCategories = Array.from(
                new Set(data.map(sub => sub.mainCategory).filter((main): main is string => main !== undefined))
            );

            setMainCategories(uniqueMainCategories);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };


    const fetchNews = async () => {
        setLoading(true);
        try {
            const url = '/api/news';
            const response = await myHttpService.get(url);
            setNewsList(response.data);
            setFilteredNews(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showToast("error", 'Error fetching news:' + error?.response?.data?.message);
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        const filterNews = () => {
            let filtered = newsList;

            if (filterOption === "active") {
                filtered = filtered.filter(news => new Date(news.releaseDate) < new Date(news.archiveDate));
            } else if (filterOption === "archived") {
                filtered = filtered.filter(news => new Date(news.releaseDate) > new Date(news.archiveDate));
            }
            if (mainCategoryFilter !== "all") {
                filtered = filtered.filter(news => news.mainCategory === mainCategoryFilter);
            }
            if (subcategoryFilter !== "all") {
                filtered = filtered.filter(news =>
                    news.subcategoriesList.some(subcategory => subcategory.subcategory === subcategoryFilter)
                );
            }


            setFilteredNews(filtered);
        };

        filterNews();
    }, [filterOption, newsList, mainCategoryFilter, subcategoryFilter]);



    const handleCreateNews = async () => {
        setLoading(true);
        try {
            const response = await myHttpService.post('/api/news', newNews);
            setNewsList([...newsList, response.data]);
            showToast("success", "News created successfully.");
            setNewNews({ title: '', body: '', author: '', archiveDate: '', releaseDate: '', mainCategory: '', otherCategoriesList: '', subcategoriesList: [] });
            setIsCreateModalOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showToast("error", 'Error creating news:' + error?.response?.data?.message);
            console.error('Error creating news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateNews = async () => {
        if (!editingNews) return;
        setLoading(true);
        try {
            const response = await myHttpService.put(`/api/news/${editingNews.id}`, editingNews);
            setNewsList(newsList.map(news => (news.id === editingNews.id ? response.data : news)));
            showToast("success", "News updated successfully.");
            setIsEditModalOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showToast("error", 'Error updating news:' + error?.response?.data);
            console.error('Error updating news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, isEditing: boolean) => {
        if (isEditing && editingNews) {
            setEditingNews({ ...editingNews, [field]: e.target.value });
        } else {
            setNewNews({ ...newNews, [field]: e.target.value });
        }
    };

    return (
        <div className="container">
            <h1 className="mb-5 color6">News Articles</h1>

            {/* Filtro tramite Select */}
            <div className="d-flex align-items-center mb-4">
                <div className="mb-4 me-4">
                    <label htmlFor="filter" className="fw-bold fs-3 color6">Filter News:</label>
                    <select
                        id="filter"
                        className="form-select"
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Filtro per mainCategory */}
                <div className="mb-4 me-4">
                    <label htmlFor="mainCategory" className="fw-bold fs-3 color6">Main Category:</label>
                    <select
                        id="mainCategory"
                        className="form-select"
                        value={mainCategoryFilter}
                        onChange={(e) => setMainCategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {mainCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro per subcategory */}
                <div className="mb-4">
                    <label htmlFor="subcategory" className="fw-bold fs-3 color6">Subcategory:</label>
                    <select
                        id="subcategory"
                        className="form-select"
                        value={subcategoryFilter}
                        onChange={(e) => setSubcategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.subcategory}>
                                {subcategory.subcategory}
                            </option>
                        ))}
                    </select>

                </div>
            </div>

            {/* Loading Spinner */}
            {loading && <OverlaySpinner />}

            {/* News List */}
            {!loading && (
                <ul className="row align-items-center row-cols-3 gap-3">
                    {filteredNews.map((news) => (
                        <li className="card mb-3 bg-color2 border border-2 border-green rounded-2" key={news.id}>
                            <h2 className="color4 mb-4"><span className="fw-bold color6">Title: </span>{news.title}</h2>
                            <p className="color4"><span className="fw-bold color6">Author: </span>{news.author}</p>
                            <p className="color4"><span className="fw-bold color6">Body: </span>{news.body}</p>
                            <p className="color4"><span className="fw-bold color6">Release date: </span>{news.releaseDate}</p>
                            <p className="color4"><span className="fw-bold color6">Archive date: </span>{news.archiveDate}</p>
                            <div>
                                <button
                                    className="border-0 hover-bright20 rounded-2 mb-2 py-1 w-100 text-light color6 bg-color6"
                                    onClick={() => {
                                        setEditingNews(news);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Update
                                </button>
                                <button
                                    className="border-0 hover-bright--10 rounded-2 mb-2 py-1 w-100 px-5 text-light bg-danger"
                                    onClick={() => console.log('Delete functionality here')}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}

                    <li className="px-0 list-unstyled">
                        <button className="card-add hover-bright20 border-0 d-flex bg-color6 rounded-2 align-items-center justify-content-center" onClick={() => setIsCreateModalOpen(true)}>
                            <span className="text-light">+</span>
                        </button>
                    </li>
                </ul>
            )}

            {/* NewsModal for Creating News */}
            <NewsModal
                news={newNews}
                isOpen={isCreateModalOpen}
                isEditing={false}
                onClose={() => setIsCreateModalOpen(false)}
                onConfirm={handleCreateNews}
                onInputChange={(e, field) => handleInputChange(e, field, false)}
                mainCategories={mainCategories}
                subcategories={subcategories}
            />

            {/* NewsModal for Editing News */}
            {editingNews && (
                <NewsModal
                    news={editingNews}
                    isOpen={isEditModalOpen}
                    isEditing={true}
                    onClose={() => setIsEditModalOpen(false)}
                    onConfirm={handleUpdateNews}
                    onInputChange={(e, field) => handleInputChange(e, field, true)}
                    mainCategories={mainCategories}
                    subcategories={subcategories}
                />
            )}
        </div>
    );
};

export default HomeBody;
