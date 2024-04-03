import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import PropTypes from "prop-types";
import { adminApiInstance } from "../../api/axios";

const EditCat = ({ onClose, fetchCategories, categoryId, categoryName }) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName); // Use categoryName prop as initial value

  const handleSaveChanges = async () => {
    try {
      // Your logic to save changes to the category goes here
      // For example, you can make an API call to update the category
      await adminApiInstance.post(`/categories/${categoryId}`, {
        name: newCategoryName,
      });

      // After saving changes, you can fetch the updated categories
      fetchCategories();
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error
    }
  };

  return (
    <Modal
      title="Edit Category"
      visible={true} // Set visible to true to show the modal
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>,
      ]}
    >
      <div>
        <label htmlFor="categoryName">Category Name:</label>
        <Input
          id="categoryName"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

EditCat.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
};

export default EditCat;
