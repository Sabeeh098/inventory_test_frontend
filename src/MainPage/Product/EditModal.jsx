import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import PropTypes from "prop-types";

const EditModal = ({ employee, visible, onClose, onSaveChanges }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Update state when the employee prop changes
    if (employee) {
      setName(employee.name || "");
      setEmail(employee.email || "");
      if (employee.role == "employee") {
        setPermissions(employee.permissions);
      }
    }
  }, [employee]);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSaveChanges = () => {
    const updatedEmployee = {
      ...employee,
      name,
      email,
      permissions,
    };

    onSaveChanges(updatedEmployee);
  };

  const updatePermission = (name, target, value) => {
    const idx = permissions.findIndex((x) => x.name === name);
    if (idx > -1) {
      const __item = permissions[idx];
      __item[target] = value.checked;
      permissions[idx] = __item;
      setPermissions(permissions);
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Edit Employee - ${employee?.name || "Unknown"}`}
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
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label me-3">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label me-3">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        {/* Add more form fields as needed */}
        {permissions &&
          permissions.map((item, idx) => (
            <div className="py-3" key={idx}>
              <div className="form-check-inline">
                <h6 className="text-primary">{item.name}</h6>
              </div>
              <div className="form-check form-switch form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={idx + "view"}
                  defaultChecked={item.view}
                  onChange={(e) =>
                    updatePermission(item.name, "view", e.target)
                  }
                />
                <label className="form-check-label" htmlFor={idx + "view"}>
                  View
                </label>
              </div>
            </div>
          ))}
      </form>
    </Modal>
  );
};

EditModal.propTypes = {
  employee: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
};

export default EditModal;
