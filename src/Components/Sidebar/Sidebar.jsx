/* eslint-disable react/prop-types */
import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";
import {
  MdDashboard,
  MdOutlineAnnouncement,
  MdPrivacyTip,
} from "react-icons/md";
import { LuCircleDollarSign } from "react-icons/lu";
import { FaUser, FaUsers } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiTerminalWindowLine } from "react-icons/ri";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsPalette } from "react-icons/bs";
const Sidebar = ({ closeDrawer }) => {
  const [active, setActive] = useState("Dashboard");
  const [openDropdown, setOpenDropdown] = useState("");

  const handleActiveRoute = (item) => {
    setActive(item);
    setOpenDropdown("");
  };

  const handleSubItemClick = (subItem) => {
    setActive(subItem);
    closeDrawer();
  };

  // const toggleDropdown = (item) => {
  //     setActive(item);
  //     setOpenDropdown(openDropdown === item ? "" : item);
  // };
  const toggleDropdown = (label) => {
    // setActive(label);
    setOpenDropdown(openDropdown === label ? "" : label);
  };

  const menuItems = [
    // {
    //   icon: <MdDashboard className="h-5 w-5" />,
    //   label: "dashboard",
    //   Link: "/",
    // },

    // {
    //   icon: <FaUser className="h-5 w-5" />,
    //   label: "Staff Details",
    //   Link: "/staff-details",
    // },
    // {
    //   icon: <FaUsers className="h-5 w-5" />,
    //   label: "Add Client",
    //   Link: "/add-client",
    // },
    // {
    //   icon: <LuCircleDollarSign className="h-5 w-5" />,
    //   label: "Expenses",
    //   Link: "/expenses",
    // },
    {
      icon: <GrNotes className="h-5 w-5" />,
      label: "Daily Report",
      Link: "/daily-report",
    },
    // {
    //   icon: <FiUserPlus className="h-5 w-5" />,
    //   label: "Create Staff",
    //   Link: "/create-staff",
    // },
    // {
    //   icon: <MdOutlineAnnouncement className="h-5 w-5" />,
    //   label: "Office Time & Notice",
    //   Link: "/office-time",
    // },
    // {
    //   icon: <IoIosNotificationsOutline className="h-5 w-5" />,
    //   label: "Notification",
    //   Link: "/notification",
    // },

    // {
    //   icon: <AiOutlineSetting className="h-5 w-5" />,
    //   label: "Settings",
    //   isDropdown: true,
    //   subItems: [
    //     {
    //       icon: <FaEdit className="h-5 w-5" />,
    //       label: "About Us",
    //       Link: "/settings/about-us",
    //     },
    //     {
    //       icon: <MdPolicy className="h-5 w-5" />,
    //       label: "Contact Us",
    //       Link: "/settings/contact-us",
    //     },
    //     {
    //       icon: <MdPrivacyTip className="h-5 w-5" />,
    //       label: "Privacy Policy",
    //       Link: "/settings/privacy-policy",
    //     },
    //     {
    //       icon: <RiTerminalWindowLine className="h-5 w-5" />,
    //       label: "Terms & Condition",
    //       Link: "/settings/terms-condition",
    //     },
    //     {
    //       icon: <BsPalette className="h-5 w-5" />,
    //       label: "Add Logo And Color ",
    //       Link: "/settings/add-logo-and-color",
    //     },
    //   ],
    // },
  ];

  return (
    <div className="bg-white h-full md:ml-16">
      <div className="flex flex-col md:h-full">
        <div className="flex flex-col gap-2 md:my-5 mb-10">
          {menuItems.map((item) => (
            <div key={item.label}>
              <div
                className={`w-72 flex justify-between items-center px-5 py-2 cursor-pointer rounded-s-2xl  ${
                  active === item.label
                    ? "bg-primary text-white font-semibold"
                    : "bg-white text-black font-semibold"
                }`}
                onClick={() =>
                  item.isDropdown
                    ? toggleDropdown(item.label)
                    : handleActiveRoute(item.label)
                }
              >
                <Link to={item.Link}>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <p>{item.label}</p>
                    {item.isDropdown && (
                      <BiChevronDown
                        className={`transform transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </Link>
              </div>
              {/* Dropdown for sub-items */}
              {item.isDropdown && openDropdown === item.label && (
                <div className="flex flex-col">
                  {item.subItems.map((subItem) => (
                    <Link to={subItem.Link} key={subItem.label}>
                      <div
                        className={`py-2 px-5 cursor-pointer  ${
                          active === subItem.label
                            ? "text-white bg-primary font-bold"
                            : "text-black "
                        }`}
                        onClick={() => handleSubItemClick(subItem.label)}
                      >
                        <p className="flex items-center gap-2 ml-10">
                          {subItem.icon}
                          {subItem.label}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Logout */}
          <Link className="text-black hover:text-black" to="/sign-in">
            <div
              className="bg-primary w-72 md:mt-20 py-3 flex justify-center items-center cursor-pointer hover:bg-primary text-white"
              onClick={() => console.log("Logged out")}
            >
              <FiLogOut className="text-xl" />
              <p className="ml-2">Log out</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
