import "./newsModal.css";
import { useState, useEffect } from "react";
import { News } from "@/app/model/News.interface";
import { Subcategory } from "@/app/model/Subcategory.interface";

interface NewsModalProps {
    news: News;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (news: News) => void;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    mainCategories: string[];
    subcategories: Subcategory[];
}

const NewsModal: React.FC<NewsModalProps> = ({
    news,
    isOpen,
    onClose,
    onConfirm,
    isEditing,
    onInputChange,
    mainCategories,
    subcategories
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);

    

    useEffect(() => {
        // Reset errors when modal is opened or closed
        if (isOpen) {
            setErrors({});
            setSelectedMainCategory(""); 
            setSelectedSubcategories([]); 
        }
    }, [isOpen]);

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setSelectedMainCategory(selectedCategory);

        // Resetta la selezione delle sottocategorie quando cambiamo la categoria principale
        setSelectedSubcategories([]);
    };

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subcategoryId = parseInt(e.target.value);
        setSelectedSubcategories(prevState => 
            e.target.checked 
            ? [...prevState, subcategoryId] 
            : prevState.filter(id => id !== subcategoryId)
        );
    };

    // Filtra le sottocategorie in base alla categoria principale selezionata
    const filteredSubcategories = subcategories.filter(subcategory => 
        subcategory.mainCategory === selectedMainCategory
    );

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
        const errorMessage = validateField(value, field);

        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: errorMessage
        }));

        onInputChange(e, field);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="color6 mb-4">{isEditing ? "Edit News" : "Create News"}</h2>

                <form className="color6">
                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="title">Title</label>
                        <input
                            className="border-green rounded-2 p-2"
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
                            className="border-green rounded-2 p-2"
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
                            className="border-green rounded-2 p-2"
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
                            className="border-green rounded-2 p-2"
                            type="date"
                            id="archiveDate"
                            value={news.archiveDate}
                            onChange={(e) => handleInputChange(e, "archiveDate")}
                        />
                        {errors.archiveDate && <span className="fw-bold text-danger mb-2">{errors.archiveDate}</span>}
                    </div>

                    {/* Main Category */}
                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold mb-2" htmlFor="mainCategory">Main Category</label>
                        <select
                            id="mainCategory"
                            value={selectedMainCategory}
                            onChange={handleMainCategoryChange}
                            className="border-green rounded-2 p-2"
                        >
                            <option value="">Select Main Category</option>
                            {mainCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategories */}
                    {selectedMainCategory && (
                        <div className="d-flex flex-column mb-4">
                            <label className="fw-bold mb-2">Subcategories</label>
                            {filteredSubcategories.map(subcategory => (
                                <div className="d-flex align-items-center mb-2" key={subcategory.id}>
                                    <input
                                    className="w-0 mb-0 me-2 modal-checkbox"
                                        type="checkbox"
                                        value={subcategory.id}
                                        checked={selectedSubcategories.includes(subcategory.id!)}
                                        onChange={handleSubcategoryChange}
                                    />
                                    <label>{subcategory.subcategory}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="red-btn-modale btn text-light p-2 border-0 hover-bright--10 me-2"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(news)}
                        className="green-btn-modale btn text-light text-nowrap p-2 border-0 hover-bright20"
                        disabled={Object.values(errors).some((error) => error !== "")}
                    >
                        {isEditing ? "Save Changes" : "Create News"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewsModal;
