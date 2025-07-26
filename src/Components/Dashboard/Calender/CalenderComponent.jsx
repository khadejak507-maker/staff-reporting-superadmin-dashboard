import { Calendar, ColorPicker } from "antd";
import dayjs from "dayjs";
import {
  useGetAllCalenderDataQuery,
  useUpdateThecolorMutation,
} from "../../../redux/Feature/calender/calenderApi";

const CalenderComponent = () => {
  const { data: calenderData } = useGetAllCalenderDataQuery();
  const [updateThecolor] = useUpdateThecolorMutation();

  const getColorForDate = (date) => {
    const item = calenderData?.data?.find((entry) =>
      dayjs(entry.date).isSame(date, "day")
    );
    return item?.color || null;
  };

  const getStaffInfo = (date) => {
    return calenderData?.data?.filter((entry) =>
      dayjs(entry.date).isSame(date, "day")
    );
  };

  const handleColorChange = async (color, item) => {
    try {
      const hexColor = color.toHexString();
      const data = {
        color: hexColor,
      };
      console.log("data", data);
      // return 0;
      await updateThecolor({ _id: item?._id, data: data }).unwrap();
    } catch (error) {
      console.error(error?.data?.message);
    }
  };

  const dateCellRender = (date) => {
    const color = getColorForDate(date);
    const staffList = getStaffInfo(date);

    return (
      <div
        className="w-full h-full p-2 rounded-md space-y-1"
        style={{ backgroundColor: color || "transparent" }}
      >
        {staffList?.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span style={{ fontSize: 12, fontWeight: 500, color: "#000" }}>
              {item.staffId?.staffId} - {item.staffId?.name}
            </span>
            <ColorPicker
              size="small"
              defaultValue={item.color || "#ffffff"}
              onChangeComplete={(color) => handleColorChange(color, item)}
              showText
              allowClear
            />
          </div>
        ))}
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default CalenderComponent;
