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
            <h1 className="mb-5 color6">News Articles</h1>

            {/* Checkbox to toggle active news */}
            <div className="mb-4">
                <label>
                    <input
                        className="mb-2 me-2"
                        type="checkbox"
                        checked={onlyActive}
                        onChange={handleCheckboxChange}
                    />
                    <span className="fw-bold fs-3 color6">Show only active news</span>
                </label>
            </div>

            {/* Render loading state */}
            {loading && <OverlaySpinner />}

            {/* Display list of news */}
            {!loading && newsList.length > 0 && (
                <ul className="d-flex row align-items-center row-cols-3 gap-3">
                    {newsList.map((news) => (
                        <li className="card mb-3 bg-color2 border border-2 border-green rounded-2" key={news.id}>
                            <h2 className="color4 mb-4"><span className="fw-bold color6">Title: </span>{news.title}</h2>
                            <p className="color4"><span className="fw-bold color6">Body: </span>{news.body}</p>
                            <p className="color4"><span className="fw-bold color6">Release date: </span>{news.releaseDate!}</p>
                            <p className="color4"><span className="fw-bold color6">Archive date: </span>{news.archiveDate}</p>
                            <div>
                                <button className="border-0 rounded-2 mb-2 py-1 w-100 text-light bg-color6" onClick={() => openModal(news)}>Update</button>
                                <button className="border-0 rounded-2 mb-2 py-1 w-100 px-5 text-light bg-danger" onClick={() => handleDeleteNews(news.id!)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

<div className="d-flex flex-column align-items-center mb-4">
                <h2 className="mb-5 color6 fw-bold fs-1">Create news</h2>

                {/* Form for creating news */}
                <form className="w-25" onSubmit={handleCreateNews}>
                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2 color6" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={newNews.title}
                            onChange={(e) => handleInputChange(e, 'title', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2 color6" htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            placeholder="Enter body content"
                            value={newNews.body}
                            onChange={(e) => handleInputChange(e, 'body', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold fs-2 mb-2 color6" htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            placeholder="Enter author name"
                            value={newNews.author}
                            onChange={(e) => handleInputChange(e, 'author', 'new')}
                        />
                    </div>

                    <div className="d-flex flex-column mb-5">
                        <label className="fw-bold fs-2 mb-2 color6" htmlFor="archiveDate">Archive Date (must be at least 30 days after the date of publication)</label>
                        <input
                            type="date"
                            id="archiveDate"
                            value={newNews.archiveDate}
                            onChange={(e) => handleInputChange(e, 'archiveDate', 'new')}
                        />
                    </div>

                    <button type="submit" className="border-0 rounded-2 mb-2 py-1 w-100 text-light bg-color6">Create News</button>
                </form>
            </div>

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
