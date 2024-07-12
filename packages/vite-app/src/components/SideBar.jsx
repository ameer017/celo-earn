import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform h-[90vh] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex justify-between items-center p-4 md:hidden">
        <h2 className="text-2xl font-bold">Menu</h2>
        <button onClick={toggleSidebar} className="text-xl">
          &times;
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-4">
        <NavLink
          to="/add-product"
          onClick={toggleSidebar}
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-bold text-xl " : "text-white"
          }
        >
          Add Product
        </NavLink>
        <NavLink
          to="/product-page"
          onClick={toggleSidebar}
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-bold text-xl " : "text-white"
          }
        >
          Product List
        </NavLink>
        <NavLink
          to="/claim-reward"
          onClick={toggleSidebar}
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-bold text-xl " : "text-white"
          }
        >
          Reward{" "}
        </NavLink>
        {/* <NavLink
          to="/add-reward"
          onClick={toggleSidebar}
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-bold text-xl " : "text-white"
          }
        >
          Add Reward{" "}
        </NavLink> */}
        <NavLink
          to="/user-info"
          onClick={toggleSidebar}
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-bold text-xl " : "text-white"
          }
        >
          User Info
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
