import "./newsModal.css";
import { useState, useEffect } from "react";
import { News } from "@/app/model/News.interface";
import { Subcategory } from "@/app/model/Subcategory.interface";
import { useDispatch } from "react-redux";
import { setMainCategory, setOtherCategoriesList, setSubcategoriesList } from '@/app/redux/newsSlice';

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
    const [selectedOtherCategories, setSelectedOtherCategories] = useState<string[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setSelectedMainCategory("");
            setSelectedSubcategories([]);
            setSelectedOtherCategories([]);
        }
    }, [isOpen]);

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setSelectedMainCategory(selectedCategory);
        
        // Update selected other categories
        setSelectedOtherCategories((prevState) => {
            const filteredCategories = prevState.filter(
                (category) => category !== selectedMainCategory
            );
            return selectedCategory
                ? [...filteredCategories, selectedCategory]
                : filteredCategories;
        });

        setSelectedSubcategories([]);
        
        // Dispatch to Redux state
        dispatch(setMainCategory(selectedCategory));
    };
    
    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subcategoryId = parseInt(e.target.value);
        setSelectedSubcategories(prevState =>
            e.target.checked
                ? [...prevState, subcategoryId]
                : prevState.filter(id => id !== subcategoryId)
        );
    
        // Dispatch to update Redux state
        const selectedSubcategoryList = subcategories.filter(subcategory =>
            selectedSubcategories.includes(subcategory.id!)
        );
                
        dispatch(setSubcategoriesList(selectedSubcategoryList));
    };
    
    const handleOtherCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const category = e.target.value;
        setSelectedOtherCategories(prevState =>
            e.target.checked
                ? [...prevState, category]
                : prevState.filter(cat => cat !== category)
        );
    
        // Dispatch to update Redux state
        dispatch(setOtherCategoriesList(selectedOtherCategories));
    };

    const filteredSubcategories = subcategories.filter(subcategory =>
        subcategory.mainCategory === selectedMainCategory
    );

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
                    {/* Input per il titolo */}
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

                    {/* Input per il corpo */}
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

                    {/* Input per l'autore */}
                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="author">Author</label>
                        <input
                            className="border-green rounded-2 p-2"
                            type="text"
                            id="author"
                            placeholder="Enter author's name"
                            value={news.author}
                            onChange={(e) => handleInputChange(e, "author")}
                        />
                        {errors.author && <span className="fw-bold text-danger mb-2">{errors.author}</span>}
                    </div>

                    {/* Input per la data di archivio */}
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

                    {/* Categoria principale */}
                    <div className="d-flex flex-column mb-2">
                        <label className="fw-bold mb-2" htmlFor="mainCategory">Main Category</label>
                        <select
                            value={selectedMainCategory}
                            onChange={handleMainCategoryChange}
                            className="form-select"
                        >
                            <option value="">Select a Main Category</option>
                            {mainCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Checkbox per altre categorie */}
                    <div className="d-flex flex-column mb-4">
                        <label className="fw-bold mb-2">Other Categories</label>
                        {mainCategories.map((category) => (
                            <div key={category}>
                                <input
                                    type="checkbox"
                                    id={`other-category-${category}`}
                                    value={category}
                                    checked={selectedOtherCategories.includes(category)}
                                    disabled={selectedMainCategory === category}
                                    onChange={handleOtherCategoriesChange}
                                />
                                <label htmlFor={`other-category-${category}`}>{category}</label>
                            </div>
                        ))}
                    </div>

                    {/* Sottocategorie */}
                    {selectedMainCategory && (
                        <div className="d-flex flex-column mb-4">
                            <label className="fw-bold mb-2">Subcategories</label>
                            {filteredSubcategories.map((subcategory) => (
                                <div key={subcategory.id}>
                                    <input
                                        type="checkbox"
                                        id={`subcategory-${subcategory.id}`}
                                        value={subcategory.id}
                                        checked={selectedSubcategories.includes(subcategory.id!)}
                                        onChange={handleSubcategoryChange}
                                    />
                                    <label htmlFor={`subcategory-${subcategory.id}`}>{subcategory.subcategory}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => onConfirm(news)}
                        >
                            {isEditing ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsModal;
