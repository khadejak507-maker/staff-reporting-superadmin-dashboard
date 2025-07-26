import { DatePicker } from "antd";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useState } from "react";

const SubscriptionGrowth = () => {
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    // Mock data
    const mockData = [
        { name: "Jan", earnings: 10 },
        { name: "Feb", earnings: 20 },
        { name: "Mar", earnings: 30 },
        { name: "Apr", earnings: 70 },
        { name: "May", earnings: 65 },
        { name: "Jun", earnings: 40 },
        { name: "Jul", earnings: 30 },
        { name: "Aug", earnings: 45 },
        { name: "Sep", earnings: 40 },
        { name: "Oct", earnings: 60 },
        { name: "Nov", earnings: 80 },
        { name: "Dec", earnings: 90 },
    ];





    const onChange = (date, dateString) => {
        setSelectedYear(dateString);
    };

    return (
        <div className="mt-4 p-4">
            <div className="bg-gray-50 rounded-lg shadow px-4 py-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-lg md:text-xl font-medium">
                        Subscription Growth
                    </h1>
                    <DatePicker
                        onChange={onChange}
                        defaultValue={dayjs(selectedYear, "YYYY")}
                        format={"YYYY"}
                        picker="year"
                        className="w-full md:w-auto"
                    />
                </div>

                {/* Chart Section */}
                <div className="mt-6" style={{ height: "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={mockData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: -10,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `${value}%`} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="earnings"
                                stroke="#d4af37"
                                fillOpacity={1}
                                fill="url(#colorEarnings)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionGrowth;
