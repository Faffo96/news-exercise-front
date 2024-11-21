"use client";

import "./homeBody.css";
import { myHttpService } from "@/app/lib/httpService";
import { showToast } from "@/app/lib/showToast";
import { News } from "@/app/model/News.interface";
import { useEffect, useState } from "react";
import OverlaySpinner from "../overlaySpinner/overlaySpinner";

const HomeBody = () => {
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [newNews, setNewNews] = useState<News>({ title: '', body: '', author: '', archiveDate: '', releaseDate: '' });
    const [onlyActive, setOnlyActive] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const url = onlyActive ? '/api/news/active' : '/api/news';
            const response = await myHttpService.get(url);
            setNewsList(response.data);
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
    }, [onlyActive]);

    const handleCreateNews = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        if (newNews) {
            try {
                const response = await myHttpService.post('/api/news', newNews);
                setNewsList([...newsList, response.data]);
                showToast("success", "News created successfully.");
                setNewNews({ title: '', body: '', author: '', archiveDate: '', releaseDate: "" });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                showToast("error", 'Error creating news:' + error?.response?.data?.message);
                console.error('Error creating news:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUpdateNews = async (id: string) => {
        setLoading(true);
        if (editingNews) {
            try {
                const response = await myHttpService.put(`/api/news/${id}`, editingNews);
                setNewsList(newsList.map(news => (news.id === id ? response.data : news)));
                showToast("success", "News updated successfully.");
                closeModal();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                showToast("error", 'Error updating news:' + error?.response?.data);
                console.error('Error updating news:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteNews = async (id: string) => {
        setLoading(true);
        try {
            await myHttpService.delete(`/api/news/${id}`);
            setNewsList(newsList.filter(news => news.id !== id));
            showToast("success", "News deleted successfully.");
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showToast("error", 'Error deleting news:' + error?.response?.data?.message);
            console.error('Error deleting news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, formType: 'new' | 'edit') => {
        if (formType === 'new') {
            setNewNews({ ...newNews, [field]: e.target.value });
        } else {
            setEditingNews((prevState) => prevState ? { ...prevState, [field]: e.target.value } : null);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyActive(e.target.checked);
    };

    const openModal = (news: News) => {
        setEditingNews(news);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    return (
        <div className="container">
            <h1 className="mb-5">News Articles</h1>

            <div className="d-flex flex-column mb-4">
                <h2 className="mb-2">Create news</h2>

                {/* Form for creating news */}
                <form onSubmit={handleCreateNews}>
                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={newNews.title}
                            onChange={(e) => handleInputChange(e, 'title', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2" htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            placeholder="Enter body content"
                            value={newNews.body}
                            onChange={(e) => handleInputChange(e, 'body', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2" htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            placeholder="Enter author name"
                            value={newNews.author}
                            onChange={(e) => handleInputChange(e, 'author', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2" htmlFor="archiveDate">Archive Date (must be at least 30 days after the date of publication)</label>
                        <input
                            type="date"
                            id="archiveDate"
                            value={newNews.archiveDate}
                            onChange={(e) => handleInputChange(e, 'archiveDate', 'new')}
                        />
                    </div>

                    <button type="submit" className="bg-primary">Create News</button>
                </form>
            </div>

            {/* Checkbox to toggle active news */}
            <div>
                <label>
                    <input
                        className="mb-2"
                        type="checkbox"
                        checked={onlyActive}
                        onChange={handleCheckboxChange}
                    />
                    Show only active news
                </label>
            </div>

            {/* Render loading state */}
            {loading && <OverlaySpinner />}

            {/* Display list of news */}
            {!loading && newsList.length > 0 && (
                <ul>
                    {newsList.map((news) => (
                        <li className="mb-3" key={news.id}>
                            <h2>{news.title}</h2>
                            <p>{news.body}</p>
                            <p>Release date: {news.releaseDate!}</p>
                            <p>Archive date: {news.archiveDate}</p>
                            <div>
                                <button onClick={() => openModal(news)}>Update</button>
                                <button onClick={() => handleDeleteNews(news.id!)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal for editing news */}
            {isModalOpen && editingNews && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit News</h2>

                        <form>
                            <div className="d-flex flex-column">
                                <label className="fw-bold mb-2" htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="Enter title"
                                    value={editingNews.title}
                                    onChange={(e) => handleInputChange(e, 'title', 'edit')}
                                />
                            </div>

                            <div className="d-flex flex-column">
                                <label className="fw-bold mb-2" htmlFor="body">Body</label>
                                <textarea
                                    id="body"
                                    placeholder="Enter body content"
                                    value={editingNews.body}
                                    onChange={(e) => handleInputChange(e, 'body', 'edit')}
                                />
                            </div>

                            <div className="d-flex flex-column">
                                <label className="fw-bold mb-2" htmlFor="author">Author</label>
                                <input
                                    type="text"
                                    id="author"
                                    placeholder="Enter author name"
                                    value={editingNews.author}
                                    onChange={(e) => handleInputChange(e, 'author', 'edit')}
                                />
                            </div>

                            <div className="d-flex flex-column">
                                <label className="fw-bold mb-2" htmlFor="archiveDate">Archive Date</label>
                                <input
                                    type="date"
                                    id="archiveDate"
                                    value={editingNews.archiveDate}
                                    onChange={(e) => handleInputChange(e, 'archiveDate', 'edit')}
                                />
                            </div>

                            <button type="button" onClick={() => handleUpdateNews(editingNews.id!)}>Save changes</button>
                            <button type="button" onClick={closeModal}>Close</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeBody;
