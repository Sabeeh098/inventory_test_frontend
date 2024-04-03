import React, { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const UpdateDetailsModal = ({ onCancel, onUpdate, data }) => {
  const [count, setCount] = useState(0);

  const handleCountChange = (e) => {
    const value = e.target.value;
    // Remove leading zeros if the value is not empty or zero
    const newValue =
      value === "" || parseInt(value, 10) === 0 ? value : parseInt(value, 10) || "";
    setCount(newValue);
  };

  const handleUpdate = () => {
    if (Number(count) > Number(data?.palletsCount))
      return toast.error("Pallet Count should be less than Pallets and Balance Out Pallets");
    onUpdate(data, count);
    onCancel();
  };

  return (
    <Modal
      visible={true}
      title="Update Pallets Count"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="palletsCount">New Pallets Count:</label>
      </div>
      <div>
        <input
          type="number"
          id="palletsCount"
          value={count}
          onChange={handleCountChange}
        />
      </div>
    </Modal>
  );
};

UpdateDetailsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default UpdateDetailsModal;
