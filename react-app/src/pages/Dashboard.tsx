import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

interface Content {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  content_url: string;
  created_at: string;
  averageRating: number;
}

const ContentDashboard: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "update" | "delete" | "rate"
  >("create");

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/content`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
      } else {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
      );
    }
    return stars;
  };

  const handleDelete = async (content: Content) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/content/${content._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchContents();
        setIsModalOpen(false);
      } else {
        console.error("Failed to delete content.");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setModalType("create");
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setModalType("update");
    setIsModalOpen(true);
  };

  const handleRate = (content: Content) => {
    setSelectedContent(content);
    setModalType("rate");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl text-gray-800 font-sans">
          Content Dashboard | Shampoo Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreate}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded"
          >
            [create new content]
          </button>
          <button
            onClick={handleLogout}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded"
          >
            [logout]
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {contents.map((content) => (
          <div key={content._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {content.title}
            </h2>
            <p className="text-gray-600 mb-2">{content.description}</p>
            <div className="flex items-center mb-4">
              {renderStars(content.averageRating)}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(content)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleRate(content)}
                className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
              >
                Rate
              </button>
            </div>
          </div>
        ))}
      </main>

      {isModalOpen && (
        <Modal
          content={selectedContent}
          modalType={modalType}
          closeModal={() => setIsModalOpen(false)}
          handleDelete={handleDelete}
          refreshContents={fetchContents}
        />
      )}
    </div>
  );
};

// Modal component to handle Create, Update, Delete, and Rate operations
const Modal: React.FC<{
  content: Content | null;
  modalType: "create" | "update" | "delete" | "rate";
  closeModal: () => void;
  handleDelete: (content: Content) => void;
  refreshContents: () => void;
}> = ({ content, modalType, closeModal, handleDelete, refreshContents }) => {
  const [formData, setFormData] = useState({
    title: content?.title || "",
    description: content?.description || "",
    category: content?.category || "game",
    thumbnail_url: content?.thumbnail_url || "",
    content_url: content?.content_url || "",
    _id: content?._id || "",
  });

  const handleSubmit = async () => {
    try {
      let response;
      if (modalType === "create") {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/content`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else if (modalType === "update" && content) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/content/${content._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else if (modalType === "delete" && content) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/content/${content._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else if (modalType === "rate" && content) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/rating/${
            content._id
          }/rate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ rating: parseInt(formData.category) }),
          }
        );
      }

      if (response?.ok) {
        refreshContents();
        closeModal();
      } else {
        alert("It's been rated already");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {modalType === "create" && "Create Content"}
          {modalType === "update" && "Update Content"}
          {modalType === "delete" && "Delete Content"}
          {modalType === "rate" && "Rate Content"}
        </h2>

        {(modalType === "create" || modalType === "update") && (
          <form>
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              className="border p-2 w-full mb-4 rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="Thumbnail URL"
            />
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded"
              value={formData.content_url}
              onChange={(e) =>
                setFormData({ ...formData, content_url: e.target.value })
              }
              placeholder="Content URL"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
              >
                Cancel
              </button>
              {modalType === "update" && (
                <button
                  type="button"
                  onClick={() => handleDelete(content!)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        )}

        {modalType === "delete" && (
          <div>
            <p>Are you sure you want to delete this content?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {modalType === "rate" && (
          <div>
            <label className="block mb-2">Rating:</label>
            <select
              className="border p-2 w-full mb-4 rounded"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDashboard;
