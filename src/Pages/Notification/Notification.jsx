/* eslint-disable no-unused-vars */
import { FiTrash2 } from "react-icons/fi";
import {
  useGetAllNotificationQuery,
  useMarkAsReadMutation,
} from "../../redux/Feature/Notification/NotificationApi";
import { useState } from "react";
import { message, Pagination } from "antd";

const Notifications = () => {
  const [currentPage, setCurrentpage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: getAllNotification } = useGetAllNotificationQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [markAsRead] = useMarkAsReadMutation();
  console.log("getAllNotification:", getAllNotification?.data);
  const notifications = getAllNotification?.data;
  const handleMarkAsRead = (_id) => {
    console.log(_id);

    try {
      const res = markAsRead(_id).unwrap();
      message.success(res.message);
    } catch (error) {
      error.message(error?.data?.message);
    }
  };
const handlePageChange = (page, pageSize) => {
    setCurrentpage(page);
    setPageSize(pageSize);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <div className="border rounded-md shadow-sm">
        {notifications?.map((notification, index) => (
          <div
            key={notification.id}
            className={`flex justify-between items-center px-4 py-3 border-b ${
              index % 2 === 0 ? "bg-orange-50" : "bg-white"
            }`}
          >
            <div>
              <p className="text-sm font-bold">{notification.title}</p>
              <p className="text-sm text-gray-500">
                {notification.officeNotice}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400">{notification.date}</p>
              <button
                className=" hover:text-primiary"
                onClick={() => handleMarkAsRead(notification._id)}
              >
                {notification?.status === "unread" ? (
                  <p>Mark As Read</p>
                ) : (
                  <p>Read</p>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
       <div className="mt-10 flex justify-center items-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={notifications?.data?.meta?.total}
          onChange={handlePageChange}
        ></Pagination>
      </div>
    </div>
  );
};

export default Notifications;
