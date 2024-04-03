import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Table from "../../EntryFile/datatable";
import { adminApiInstance } from "../../api/axios";
import { EditIcon, DeleteIcon } from "../../EntryFile/imagePath";
import EditModal from "./EditModal";

const UserList = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeeAdmins = async () => {
    try {
      const response = await adminApiInstance.get("/employeeAdmins");
      setData(response.data.employeeAdmins);
    } catch (error) {
      console.error("Error fetching employee admins:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeAdmins();
  }, []);

  const confirmText = (employeeId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(employeeId);
      }
    });
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await adminApiInstance.delete(`/deleteEmployee/${employeeId}`);
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      fetchEmployeeAdmins();
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Handle error scenario if needed
    }
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedEmployee(null);
    setModalVisible(false);
  };

  const saveChanges = async (updatedEmployee) => {
    try {
      const response = await adminApiInstance.patch(
        `/editEmployee/${updatedEmployee._id}`,
        updatedEmployee
      );

      if (response.status === 200) {
        console.log("Employee edited successfully");
        closeEditModal();
        fetchEmployeeAdmins();
      } else {
        console.error("Error editing employee:", response.data);
        // Handle error scenario if needed
      }
    } catch (error) {
      console.error("Error editing employee:", error);
      // Handle error scenario if needed
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
         
          <Link className="me-3" to="#" onClick={() => openEditModal(record)}>
            <img src={EditIcon} alt="Edit" />
          </Link>
          <Link
            className="confirm-text"
            to="#"
            onClick={() => confirmText(record._id)}
          >
            <img src={DeleteIcon} alt="Delete" />
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Employee Admin List</h4>
              <h6>Manage your employee admins</h6>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        employee={selectedEmployee}
        visible={modalVisible}
        onClose={closeEditModal}
        onSaveChanges={saveChanges}
      />
    </>
  );
};

export default UserList;
