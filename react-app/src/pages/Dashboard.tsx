import React, { useState, useEffect } from "react";
// import { FaStar } from "react-icons/fa";

interface Product {
  _id: string;
  barcode: string;
  code: string;
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: {
    amount: number;
    currency: string;
  };
  volume?: {
    value: number;
    unit: string;
  };
  imageUrl?: string;
  tags?: string[];
  attributes?: Map<string, string>;
  aiDescription?: {
    content?: string;
    model?: string;
    generatedAt?: Date;
  };
  stockQty: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContentDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedContent, setSelectedContent] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "update" | "delete" | "rate" | "import-export"
  >("create");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products`,
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
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  // const renderStars = (rating: number) => {
  //   const stars = [];
  //   for (let i = 1; i <= 5; i++) {
  //     stars.push(
  //       <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
  //     );
  //   }
  //   return stars;
  // };

  const handleDelete = async (product: Product) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchProducts();
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
  // const handleEdit = (product: Product) => {
  //   setSelectedContent(product);
  //   setModalType("update");
  //   setIsModalOpen(true);
  // };

  // const handleRate = (product: Product) => {
  //   setSelectedContent(product);
  //   setModalType("rate");
  //   setIsModalOpen(true);
  // };

  function handleImportRequest(): void {
    setSelectedContent(null);
    setModalType("import-export");
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl text-gray-800 font-sans">
          Content Dashboard | Shampoo Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreate}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded-sm"
          >
            Create new product
          </button>
          <button
            onClick={handleImportRequest}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded-sm"
          >
            Import/Export Products
          </button>
          {/* <button
            onClick={handleCreate}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded-sm"
          >
            Settings
          </button> */}
          <button
            onClick={handleLogout}
            className=" text-gray-800 hover:bg-gray-300  py-2 px-4 rounded-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => (
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
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleRate(content)}
                className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded-sm"
              >
                Rate
              </button>
            </div>
          </div>
        ))}
      </main> */}

      {isModalOpen && (
        <Modal
          product={selectedContent}
          modalType={modalType}
          closeModal={() => setIsModalOpen(false)}
          handleDelete={handleDelete}
          refreshContents={fetchProducts}
        />
      )}
    </div>
  );
};

// Modal component to handle Create, Update, Delete, and Rate operations
const Modal: React.FC<{
  product: Product | null;
  modalType: "create" | "update" | "delete" | "rate" | "import-export";
  closeModal: () => void;
  handleDelete: (product: Product) => void;
  refreshContents: () => void;
}> = ({ product, modalType, closeModal, handleDelete, refreshContents }) => {
  const [formData, setFormData] = useState({
    ...product,
    name: product?.name || "",
    description: product?.description || "",
    barcode: product?.barcode || "",
    brand: product?.brand || "",
    category: product?.category || "",
    price: product?.price || { amount: 0, currency: "USD" },
    volume: product?.volume || { value: 0, unit: "ml" },
    imageUrl: product?.imageUrl || "",
    tags: product?.tags || [],
    attributes: product?.attributes || new Map(),
    stockQty: product?.stockQty || 0,
    isActive: product?.isActive || true,
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
      } else if (modalType === "update" && product) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/${product._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else if (modalType === "delete" && product) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/products/${product._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else if (modalType === "rate" && product) {
        response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URI}/api/rating/${
            product._id
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
              className="border p-2 w-full mb-4 rounded-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              className="border p-2 w-full mb-4 rounded-sm"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded-sm"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="Thumbnail URL"
            />
            <input
              type="text"
              className="border p-2 w-full mb-4 rounded-sm"
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
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded-sm"
              >
                Cancel
              </button>
              {modalType === "update" && (
                <button
                  type="button"
                  onClick={() => handleDelete(content!)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-sm"
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
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-sm"
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
              className="border p-2 w-full mb-4 rounded-sm"
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
                className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded-sm"
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
