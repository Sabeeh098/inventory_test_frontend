import React from "react";
import PropTypes from "prop-types";

const Activities = ({ location }) => {
  const notifications = location.state ? location.state.notifications : [];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>All Notifications</h4>
            <h6>View your all activities</h6>
          </div>
        </div>
        {/* /product list */}
        <div className="activity">
          <div className="activity-box">
            <ul className="activity-list">
              {notifications.map((notification, index) => (
                <li key={index}>
                  <div className="media-body flex-grow-1">
                    <p className="noti-details">
                      <span className="noti-title" style={{ color: "green" }}>
                        Load Number: {notification.loadNumber}
                      </span>
                      <br />
                      <span className="noti-title">
                        Remaining Pallets:{" "}
                        <span style={{ color: "red" }}>
                          {notification.remainingPalletsCount}
                        </span>
                        <br />
                        <span style={{ color: "red" }}>
                          Please Reorder this Load
                        </span>
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

Activities.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      notifications: PropTypes.array,
    }),
  }),
};

export default Activities;
