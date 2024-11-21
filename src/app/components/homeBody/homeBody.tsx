"use client";

import "./homeBody.css";
import { myHttpService } from "@/app/lib/httpService";
import { showToast } from "@/app/lib/showToast";
import { News } from "@/app/model/News.interface";
import { useEffect, useState } from "react";
import OverlaySpinner from "../overlaySpinner/overlaySpinner";
import NewsModal from "../modal/newsModal";

const HomeBody = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]); // Lista filtrata
    const [loading, setLoading] = useState<boolean>(false);
    const [filterOption, setFilterOption] = useState<string>("all"); // Stato per il filtro
    const [newNews, setNewNews] = useState<News>({ title: '', body: '', author: '', archiveDate: '', releaseDate: '' });
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const url = '/api/news';
            const response = await myHttpService.get(url);
            setNewsList(response.data);
            setFilteredNews(response.data); // Inizializzare la lista filtrata
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

    // Filtra l'array in base all'opzione selezionata
    useEffect(() => {
        const filterNews = () => {
            if (filterOption === "all") {
                setFilteredNews(newsList);
            } else if (filterOption === "active") {
                setFilteredNews(newsList.filter(news => new Date(news.releaseDate) < new Date(news.archiveDate)));
            } else if (filterOption === "archived") {
                setFilteredNews(newsList.filter(news => new Date(news.releaseDate) > new Date(news.archiveDate)));
            }
        };
        filterNews();
    }, [filterOption, newsList]);

    const handleCreateNews = async () => {
        setLoading(true);
        try {
            const response = await myHttpService.post('/api/news', newNews);
            setNewsList([...newsList, response.data]);
            showToast("success", "News created successfully.");
            setNewNews({ title: '', body: '', author: '', archiveDate: '', releaseDate: '' });
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
            <div className="mb-4">
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

            {/* Loading Spinner */}
            {loading && <OverlaySpinner />}

            {/* News List */}
            {!loading && filteredNews.length > 0 && (
                <ul className="row align-items-center row-cols-3 gap-3">
                    {filteredNews.map((news) => (
                        <li className="card mb-3 bg-color2 border border-2 border-green rounded-2" key={news.id}>
                            <h2 className="color4 mb-4"><span className="fw-bold color6">Title: </span>{news.title}</h2>
                            <p className="color4"><span className="fw-bold color6">Body: </span>{news.body}</p>
                            <p className="color4"><span className="fw-bold color6">Release date: </span>{news.releaseDate}</p>
                            <p className="color4"><span className="fw-bold color6">Archive date: </span>{news.archiveDate}</p>
                            <div>
                                <button
                                    className="border-0 rounded-2 mb-2 py-1 w-100 text-light bg-color6"
                                    onClick={() => {
                                        setEditingNews(news);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    Update
                                </button>
                                <button
                                    className="border-0 rounded-2 mb-2 py-1 w-100 px-5 text-light bg-danger"
                                    onClick={() => console.log('Delete functionality here')}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}

                    <li className="px-0 list-unstyled">
                        <button className="card-add border-0 d-flex bg-color6 rounded-2 align-items-center justify-content-center" onClick={() => setIsCreateModalOpen(true)}>
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
                />
            )}
        </div>
    );
};

export default HomeBody;
