"use client";

import "./homeBody.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OverlaySpinner from "../overlaySpinner/overlaySpinner";
import { News } from "@/app/model/News.interface";
import { Subcategory } from "@/app/model/Subcategory.interface";
import { AppDispatch, RootState } from "@/app/redux/store";
import { deleteNews, fetchNews } from "@/app/redux/newsSlice";
import { fetchSubcategories } from "@/app/redux/subcategoriesSlice";
import { fetchMainCategories } from "@/app/redux/mainCategoriesSlice";
import UpdateNewsModal from "../updateNewsModal/updateNewsModal";
import CreateNewsModal from "../createNewsModal/createNewsModal";
import ConfirmationModal from "../confirmationModal/confirmationModal";

const HomeBody = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { newsList, status: newsStatus, loading: newsLoading } = useSelector((state: RootState) => state.news);
    const { subcategories, loading: subcategoriesLoading } = useSelector(
        (state: RootState) => state.subcategories
    );

    const { mainCategories, status: mainCategoriesStatus } = useSelector(
        (state: RootState) => state.mainCategories
    );

    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [filterOption, setFilterOption] = useState<string>("all");
    const [mainCategoryFilter, setMainCategoryFilter] = useState<string>("all");
    const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [newsIdToDelete, setNewsIdToDelete] = useState<string | null>(null);


    const handleEditNews = (news: News) => {
        setEditingNews(news);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchNews());
        dispatch(fetchSubcategories("id"));
        dispatch(fetchMainCategories());
    }, [dispatch]);

    useEffect(() => {
        const filterNews = () => {
            let filtered = newsList;

            if (filterOption === "active") {
                filtered = filtered.filter((news: News) => new Date(news.releaseDate) < new Date(news.archiveDate));
            } else if (filterOption === "archived") {
                filtered = filtered.filter((news: News) => new Date(news.releaseDate) > new Date(news.archiveDate));
            }
            if (mainCategoryFilter !== "all") {
                filtered = filtered.filter((news: News) => news.mainCategory === mainCategoryFilter);
            }
            if (subcategoryFilter !== "all") {
                filtered = filtered.filter((news: News) =>
                    news.subcategoriesList.some(subcategory => subcategory.subcategory === subcategoryFilter)
                );
            }

            setFilteredNews(filtered);
        };

        filterNews();
    }, [filterOption, mainCategoryFilter, subcategoryFilter, newsList]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
        if (editingNews) {
            setEditingNews({ ...editingNews, [field]: e.target.value });
        }
    };

    const handleDeleteNews = async (newsId: string) => {
        await dispatch(deleteNews(newsId));
        dispatch(fetchNews());
    };
    

    const handleDeleteClick = (newsId: string) => {
        setNewsIdToDelete(newsId);
    };

    const closeModal = () => {
        setNewsIdToDelete(null);
    };

    return (
        <div className="container">
            <h1 className="mb-5 color6">News Articles</h1>

            {/* Filters */}
            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center mb-4">
                {/* Filter by status */}
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

                {/* Filter by main category */}
                <div className="mb-4 me-4">
                    <label htmlFor="mainCategory" className="fw-bold fs-3 color6">Main Category:</label>
                    <select
                        id="mainCategory"
                        className="form-select"
                        value={mainCategoryFilter}
                        onChange={(e) => setMainCategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {mainCategoriesStatus === 'succeeded' ? (
                            mainCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>
                </div>

                {/* Filter by subcategory */}
                <div className="mb-4">
                    <label htmlFor="subcategory" className="fw-bold fs-3 color6">Subcategory:</label>
                    <select
                        id="subcategory"
                        className="form-select"
                        value={subcategoryFilter}
                        onChange={(e) => setSubcategoryFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {subcategories.map((subcategory: Subcategory) => (
                            <option key={subcategory.id} value={subcategory.subcategory}>
                                {subcategory.subcategory}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* NewsLoading Loading Spinner */}
            {newsLoading && <OverlaySpinner />}

            {/* MainCategoriesStatus Loading Spinner */}
            {mainCategoriesStatus === "loading" && <OverlaySpinner />}

            {/* Subcategories Loading Spinner */}
            {subcategoriesLoading && <OverlaySpinner />}

            {/* News List */}
            {newsStatus === "succeeded" && (
                <ul className="row align-items-center gap-3">
                    {filteredNews.map((news) => (
                        <li className="card mb-3 bg-color2 border border-2 border-green rounded-2" key={news.id}>
                            <h2 className="color4 mb-4"><span className="fw-bold color6">Title: </span>{news.title}</h2>
                            <p className="color4"><span className="fw-bold color6">Author: </span>{news.author}</p>
                            <p className="color4"><span className="fw-bold color6">Categories: </span>{news.mainCategory}</p>
                            <p className="color4">
                                <span className="fw-bold color6">Other categories: </span>
                                {Array.isArray(news.otherCategoriesList) ? news.otherCategoriesList.join(", ") : "No categories available"}
                            </p>
                            <p className="color4">
                                <span className="fw-bold color6">Subcategories: </span>
                                {news.subcategoriesList.length > 0 ? (
                                    news.subcategoriesList.map((subcategory, index) => (
                                        <span key={index}>
                                            {subcategory.subcategory}{index < news.subcategoriesList.length - 1 ? ", " : ""}
                                        </span>
                                    ))
                                ) : (
                                    "No subcategories available"
                                )}
                            </p>
                            <p className="color4"><span className="fw-bold color6">Body: </span>{news.body}</p>
                            <p className="color4"><span className="fw-bold color6">Release date: </span>{news.releaseDate}</p>
                            <p className="color4"><span className="fw-bold color6">Archive date: </span>{news.archiveDate}</p>
                            <div>
                                <button
                                    className="border-0 hover-bright20 rounded-2 mb-2 py-1 w-100 text-light color6 bg-color6"
                                    onClick={() => handleEditNews(news)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="border-0 hover-bright20 rounded-2 mb-2 py-1 w-100 text-light color6 bg-danger"
                                    onClick={() => handleDeleteClick(news.id!)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                    <button
                        className="card-add hover-bright20 border-0 d-flex bg-color6 rounded-2 align-items-center justify-content-center"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <span className="text-light">+</span>
                    </button>

                </ul>
            )}
            {/* Modal for creating news */}
            {isCreateModalOpen && (
                <CreateNewsModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    mainCategories={mainCategories}
                    subcategories={subcategories}
                />
            )}

            {/* Modal for editing news */}
            {editingNews && (
                <UpdateNewsModal
                    news={editingNews}
                    isOpen={isEditModalOpen}
                    isEditing={true}
                    onClose={() => setIsEditModalOpen(false)}
                    onInputChange={handleInputChange}
                    mainCategories={mainCategories}
                    subcategories={subcategories}
                />
            )}

            {/* Modal for confirmation */}
            <ConfirmationModal
                show={newsIdToDelete !== null}
                title="Delete News"
                onHide={closeModal}
                onConfirm={async () => {
                    if (newsIdToDelete) {
                        await handleDeleteNews(newsIdToDelete); 
                        closeModal(); 
                    }
                }}
                loading={newsLoading}
            />

        </div>
    );
};

export default HomeBody;
