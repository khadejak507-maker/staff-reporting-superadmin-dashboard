import { Col } from "antd";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { BsDatabase } from "react-icons/bs";
import { AllImages } from "../../../assets/image/AllImages";

const AnalyticsInfo = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* earning */}
                <Col>
                    <div className="flex flex-col justify-between md:justify-center items-center border-r-2 p-4 bg-white rounded-md gap-5  h-auto md:h-28">
                        <div className="flex  gap-3 items-center">
                            <p className=" rounded-full flex justify-center items-center">
                                <BsDatabase size={20} />
                            </p>
                            <p className="text-base md:text-lg ">Total Earning</p>
                        </div>
                        <p className="text-green-500 text-xl font-bold ">
                            150.10K
                        </p>
                    </div>
                </Col>
                {/* user  */}
                <Col>
                    <div className="flex flex-col justify-between md:justify-center items-center border-r-2 p-4 bg-white rounded-md gap-5  h-auto md:h-28">
                        <div className="flex gap-3 items-center">
                            <p className="bg-white rounded-full flex justify-center items-center">
                                <FaUsers size={20} />
                            </p>
                            <p className="text-base md:text-lg ">Total User</p>
                        </div>
                        <p className="text-green-500 text-xl font-bold ">
                            25.5K
                        </p>
                    </div>
                </Col>
                {/* patient */}
                <Col>
                    <div className="flex flex-col justify-between md:justify-center items-center border-r-2 p-4 bg-white rounded-md gap-5  h-auto md:h-28">
                        <div className="flex gap-3 items-center">
                            <p className="bg-white rounded-full flex justify-center items-center">
                                <img src={AllImages.patient} alt="" />
                            </p>

                            <p className="text-base md:text-lg ">Total Patients</p>
                        </div>
                        <p className="text-green-500 text-xl font-bold ">
                            920
                        </p>
                    </div>
                </Col>
                {/* doctor */}
                <Col>
                    <div className="flex flex-col justify-between md:justify-center items-center border-r-2 p-4 bg-white rounded-md gap-5  h-auto md:h-28">
                        <div className="flex gap-3 items-center">
                            <p className="bg-white rounded-full flex justify-center items-center">
                                <FaUserDoctor size={20} />
                            </p>

                            <p className="text-base md:text-lg ">Total Doctors</p>
                        </div>
                        <p className="text-green-500 text-xl font-bold ">
                            920
                        </p>
                    </div>
                </Col>
                {/* blocked      */}
                <Col>
                    <div className="flex flex-col justify-between md:justify-center items-center border-r-2 p-4 bg-white rounded-md gap-5  h-auto md:h-28">
                        <div className="flex gap-3 items-center">
                            <p className="bg-white rounded-full flex justify-center items-center">
                                <img src={AllImages.blockUser} alt="" />
                            </p>

                            <p className="text-base md:text-lg ">Blocked Accounts</p>
                        </div>
                        <p className="text-red-500 text-xl font-bold ">
                            920
                        </p>
                    </div>
                </Col>

            </div>
        </div>
    );
};

export default AnalyticsInfo; 