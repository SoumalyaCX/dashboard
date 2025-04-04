import React from "react";
import "./StatCards.scss";
import totalCustomersIcon from "../../assets/icons/profile-2user.png";
import membersIcon from "../../assets/icons/profile-tick.png";
import activeNowIcon from "../../assets/icons/monitor.png";
import user1 from "../../assets/icons/Ellipse 58.png";
import user2 from "../../assets/icons/Ellipse 59.png";
import user3 from "../../assets/icons/Ellipse 60.png";
import user4 from "../../assets/icons/Ellipse 61.png";
import user5 from "../../assets/icons/Ellipse 62.png";
import arrowUp from "../../assets/icons/arrow-up 1.png";
import arrowDown from "../../assets/icons/arrow-down 1.png";

const StatCards = ({ isMobile }) => {
  return (
    <div className={`stat-cards ${isMobile ? "mobile" : ""}`}>
      <div className="stat-card">
        <div className="stat-icon total-customers">
          <img src={totalCustomersIcon} alt="" />
        </div>
        <div className="stat-info">
          <h4>Total Customers</h4>
          <h2>5,423</h2>
          <div className="stat-change positive">
            <img src={arrowUp} alt="" />
            <span class="perc">16%&nbsp;</span>
            <span> this month</span>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon members">
          <img src={membersIcon} alt="" />
        </div>
        <div className="stat-info">
          <h4>Members</h4>
          <h2>1,893</h2>
          <div className="stat-change negative">
            <img src={arrowDown} alt="" />
            <span class="perc">1%&nbsp;</span> <span>this month</span>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active-now">
          <img src={activeNowIcon} alt="" />
        </div>
        <div className="stat-info">
          <h4>Active Now</h4>
          <h2>189</h2>
          <div className="active-users">
            <img src={user1} alt="User" />
            <img src={user2} alt="User" />
            <img src={user3} alt="User" />
            <img src={user4} alt="User" />
            <img src={user5} alt="User" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
