import { ConfigProvider, Input } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Daily from "./Daily";
import Weekly from "./Weekly";

const Reports = () => {
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);

  const handleSearch = () => {
    // Handle search logic here
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
        <div className="flex items-center gap-2 bg-primary rounded-md ">
          <button
            onClick={() => setActive(true)}
            className={`px-3 py-2 rounded-md ${
              active ? "bg-white text-primary " : "text-white"
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setActive(false)}
            className={`px-3 py-2 rounded-md ${
              !active ? "bg-white text-primary" : "text-white"
            }`}
          >
            Monthly Report
          </button>
        </div>

        <div>
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  borderRadius: 0,
                  hoverBorderColor: "none",
                  activeBorderColor: "none",
                },
              },
            }}
          >
            <div className="flex gap-2 items-center relative">
              <Input
                placeholder="Search "
                allowClear
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onPressEnter={handleSearch}
                prefix={
                  <SearchOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleSearch}
                  />
                }
              />

              <button
                onClick={handleSearch}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primaryColor text-white p-2 rounded-r-lg"
              >
                search
              </button>
            </div>
          </ConfigProvider>
        </div>
      </div>
      <div className="mt-5 ">{active ? <Daily /> : <Weekly />}</div>
    </div>
  );
};

export default Reports;
