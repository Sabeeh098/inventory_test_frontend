import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApiInstance } from "../../api/axios";
import { DeleteIcon, EditIcon } from "../../EntryFile/imagePath";
import EditCat from "./EditCat";

const AddCat = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminApiInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!categoryName.trim()) {
        alert("Category name cannot be empty");
        return;
      }

      const response = await adminApiInstance.post("/addCategory", {
        name: categoryName,
      });
      console.log("Category added:", response.data);

      setCategoryName("");
      // After adding the category, fetch categories again to update the table
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category. Please try again.");
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await adminApiInstance.delete(`/categories/${categoryId}`);
      // After deleting the category, fetch categories again to update the table
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    }
  };

  const handleEdit = (categoryId, categoryName) => {
    setEditCategoryId(categoryId);
    setCategoryName(categoryName); // Set the category name in the state
    setShowEditModal(true);
  };

  const handleCheckboxChange = (event, categoryId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Send selected category IDs to the backend
      await adminApiInstance.post("/deleteSelectedCategories", {
        categoryIds: selectedCategories,
      });

      // After deleting the categories, fetch categories again to update the table
      fetchCategories();

      // Clear selected categories
      setSelectedCategories([]);
    } catch (error) {
      console.error("Error deleting categories:", error);
      alert("Error deleting categories. Please try again.");
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Product Add Category</h4>
              <h6>Create new product Category</h6>
            </div>
          </div>
          {/* Add form */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button
                    className="btn btn-submit me-2"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button className="btn btn-cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          {/* Table for displaying categories */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">
                Categories{" "}
                {selectedCategories.length > 0 && (
                  <Link
                    className="confirm-text me-3 lspace"
                    to="#"
                    onClick={handleDeleteSelected}
                  >
                    <img src={DeleteIcon} alt="Delete" />
                  </Link>
                )}
              </h5>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Checkbox</th>
                    <th style={{ width: "10%" }}>Index</th>
                    <th style={{ width: "60%" }}>Name</th>
                    <th style={{ width: "20%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={(e) =>
                            handleCheckboxChange(e, category._id)
                          }
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <Link
                          className="confirm-text me-3 lspace"
                          to="#"
                          onClick={() => handleDelete(category._id)}
                        >
                          <img src={DeleteIcon} alt="Delete" />
                        </Link>
                        <Link
                          className="me-3"
                          to="#"
                          onClick={() => handleEdit(category._id, category.name)}
                        >
                          <img src={EditIcon} alt="Edit" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* End of table */}
        </div>
      </div>
      {showEditModal && (
        <EditCat
          categoryId={editCategoryId}
          categoryName={categoryName} // Pass the category name as prop
          onClose={() => setShowEditModal(false)}
          fetchCategories={fetchCategories}
        />
      )}
    </>
  );
};

export default AddCat;
