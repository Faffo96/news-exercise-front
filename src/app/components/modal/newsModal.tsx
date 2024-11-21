import React, { useState, useEffect } from "react";
import { News } from "@/app/model/News.interface";

interface NewsModalProps {
    news: News;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (news: News) => void;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ 
    news, 
    isOpen, 
    onClose, 
    onConfirm, 
    isEditing, 
    onInputChange 
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Reset errors when modal is opened or closed
        if (isOpen) {
            setErrors({});
        }
    }, [isOpen]);

    // Validation function
    const validateField = (value: string, field: string) => {
        let errorMessage = "";

        switch (field) {
            case "title":
                if (!value) errorMessage = "Title cannot be null.";
                else if (value.length > 150) errorMessage = "Title cannot exceed 150 chars.";
                else if (/\d/.test(value)) errorMessage = "Title cannot contain numbers.";
                break;
            case "body":
                if (!value) errorMessage = "Body cannot be null.";
                else if (value.length < 80) errorMessage = "Body must have at least 80 characters.";
                break;
            case "author":
                if (!value) errorMessage = "Author cannot be null.";
                break;
            case "archiveDate":
                if (!value) errorMessage = "Archive Date cannot be null.";
                break;
            default:
                break;
        }

        return errorMessage;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const { value } = e.target;
        // Validate the field
        const errorMessage = validateField(value, field);

        // Update errors
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: errorMessage
        }));

        // Call the external change handler
        onInputChange(e, field);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isEditing ? "Edit News" : "Create News"}</h2>

                <form>
                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter title"
                            value={news.title}
                            onChange={(e) => handleInputChange(e, "title")}
                        />
                        {errors.title && <span className="fw-bold text-danger mb-2">{errors.title}</span>}
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            placeholder="Enter body content"
                            value={news.body}
                            onChange={(e) => handleInputChange(e, "body")}
                        />
                        {errors.body && <span className="fw-bold text-danger mb-2">{errors.body}</span>}
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            placeholder="Enter author name"
                            value={news.author}
                            onChange={(e) => handleInputChange(e, "author")}
                        />
                        {errors.author && <span className="fw-bold text-danger mb-2">{errors.author}</span>}
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="archiveDate">Archive Date</label>
                        <input
                            type="date"
                            id="archiveDate"
                            value={news.archiveDate}
                            onChange={(e) => handleInputChange(e, "archiveDate")}
                        />
                        {errors.archiveDate && <span className="fw-bold text-danger mb-2">{errors.archiveDate}</span>}
                    </div>

                    <button 
                        type="button" 
                        onClick={() => onConfirm(news)}
                        className="btn btn-primary"
                        disabled={Object.values(errors).some((error) => error !== "")}
                    >
                        {isEditing ? "Save Changes" : "Create News"}
                    </button>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewsModal;
