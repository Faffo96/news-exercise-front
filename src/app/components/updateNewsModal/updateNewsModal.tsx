import { useState, useEffect } from "react";
import { News } from "@/app/model/News.interface";
import { Subcategory } from "@/app/model/Subcategory.interface";
import { myHttpService } from "@/app/lib/httpService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { fetchNews } from "@/app/redux/newsSlice";

interface UpdateNewsModalProps {
    news: News;
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => void;
    mainCategories: string[];
    subcategories: Subcategory[];
}

const UpdateNewsModal: React.FC<UpdateNewsModalProps> = ({
    news,
    isOpen,
    onClose,
    isEditing,
    onInputChange,
    mainCategories,
    subcategories
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
    const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
    const [selectedOtherCategories, setSelectedOtherCategories] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (isEditing) {
                setSelectedMainCategory(news.mainCategory || "");
                setSelectedSubcategories(news.subcategoriesList?.map((sub) => sub.id!) || []);
                setSelectedOtherCategories(news.otherCategoriesList || []);
            } else {
                setSelectedMainCategory("");
                setSelectedSubcategories([]);
                setSelectedOtherCategories([]);
            }
        }
    }, [isOpen, isEditing, news]);

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setSelectedMainCategory(selectedCategory);

        setSelectedSubcategories([]); 

        setSelectedOtherCategories((prevState) => {
            const filteredCategories = prevState.filter((category) => category !== selectedMainCategory);
            return selectedCategory ? [...filteredCategories, selectedCategory] : filteredCategories;
        });
    };

    const handleOtherCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const category = e.target.value;
        setSelectedOtherCategories((prevState) =>
            e.target.checked
                ? [...prevState, category]
                : prevState.filter((cat) => cat !== category)
        );
    };

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const subcategoryId = parseInt(e.target.value);
        setSelectedSubcategories((prevState) =>
            e.target.checked
                ? [...prevState, subcategoryId]
                : prevState.filter((id) => id !== subcategoryId)
        );
    };

    const filteredSubcategories = subcategories.filter(
        (subcategory) => subcategory.mainCategory === selectedMainCategory
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
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: errorMessage,
        }));
    
        onInputChange(e, field);
    };
    

    const handleConfirm = async () => {

        const updatedNews: News = {
            ...news,
            mainCategory: selectedMainCategory,
            otherCategoriesList: selectedOtherCategories,
            subcategoriesList: selectedSubcategories.map((id) => ({ id })), 
            title: news.title,
            body: news.body,
            author: news.author,
            archiveDate: news.archiveDate,
        };

        try {
            const response = await myHttpService.put(`/api/news/${news.id}`, updatedNews);

            if (response.status !== 200) {
                throw new Error("Failed to update news.");
            }


            const updatedNewsData = response.data;

            console.log("News updated:", updatedNewsData);

            // Close modal after update
            onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error updating news:", error);
            setErrors((prevErrors) => ({
                ...prevErrors,
                submit: error?.message || "Error updating news. Please try again later.",
            }));
        } finally {
            dispatch(fetchNews());
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="color6 mb-4">{isEditing ? "Edit News" : "Create News"}</h2>

                <form className="color6">
                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="title">
                            Title
                        </label>
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
                        <label className="fw-bold mb-2" htmlFor="body">
                            Body
                        </label>
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
                        <label className="fw-bold mb-2" htmlFor="author">
                            Author
                        </label>
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

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2" htmlFor="archiveDate">
                            Archive Date
                        </label>
                        <input
                            className="border-green rounded-2 p-2"
                            type="date"
                            id="archiveDate"
                            value={news.archiveDate}
                            onChange={(e) => handleInputChange(e, "archiveDate")}
                        />
                        {errors.archiveDate && <span className="fw-bold text-danger mb-2">{errors.archiveDate}</span>}
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2">Main Category</label>
                        <select
                            id="mainCategory"
                            value={selectedMainCategory}
                            onChange={handleMainCategoryChange}
                            className="border-green rounded-2 p-2"
                        >
                            {mainCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2">Other Categories</label>
                        {mainCategories
                            .filter((category) => category !== selectedMainCategory)
                            .map((category) => (
                                <div key={category}>
                                    <input
                                        className="w-25"
                                        type="checkbox"
                                        id={category}
                                        value={category}
                                        checked={selectedOtherCategories.includes(category)}
                                        onChange={handleOtherCategoriesChange}
                                        disabled={category === selectedMainCategory}
                                    />
                                    <label htmlFor={category}>{category}</label>
                                </div>
                            ))}
                    </div>

                    <div className="d-flex flex-column">
                        <label className="fw-bold mb-2">Subcategories</label>
                        {filteredSubcategories.map((sub) => (
                            <div key={sub.id}>
                                <input
                                    className="w-25"
                                    type="checkbox"
                                    value={sub.id}
                                    checked={selectedSubcategories.includes(sub.id!)}
                                    onChange={handleSubcategoryChange}
                                />
                                <label>{sub.subcategory}</label>
                            </div>
                        ))}
                    </div>
                </form>

                <div className="mt-3 d-flex justify-content-between">
                    <button className="btn text-light grey-btn-modale hover-bright--10 me-2" onClick={onClose}>
                        Close
                    </button>
                    <button className="btn text-light green-btn-modale hover-bright20" onClick={handleConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNewsModal;