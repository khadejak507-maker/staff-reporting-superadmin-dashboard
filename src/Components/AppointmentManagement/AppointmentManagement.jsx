import { AllImages } from "../../assets/image/AllImages";
import ConsultationHistory from "./ConsultationHistory";

const AppointmentManagement = () => {
    return (
        <div className="bg-white p-5">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-b-primary pb-5">
                <div >
                    <h1 className="text-xl md:text-3xl font-bold mb-5">Patients details</h1>
                    <div className="flex items-center gap-2">
                        <img src={AllImages.user} alt="" />
                        <p>John Doe</p>
                    </div>
                    <div className="flex items-center gap-2">
                        Age:
                        <p>20</p>
                    </div>
                    <div className="flex items-center gap-2">
                        Gender:
                        <p>Male</p>
                    </div>
                    <div className="flex items-center gap-2">
                        Reason:
                        <p>Chronic pain issue- back pain</p>
                    </div>
                </div>

                <div >
                    <h1 className="text-xl md:text-3xl font-bold mb-5">Doctor details</h1>
                    <div className="flex items-center gap-2">
                        <img src={AllImages.user} alt="" />
                        <p>John Doe</p>
                    </div>
                    <div className="flex items-center gap-2">
                        Specializattion:
                        <p>Cardiologist</p>
                    </div>
                    <div className="flex items-center gap-2">
                        Experience:
                        <p>5 years</p>
                    </div>

                </div>
            </div>
            <div className="my-5 border-b border-b-primary pb-10">

                <div className="flex justify-between items-center gap-2">
                    <p className="font-bold">Appointment date :</p>
                    <p>01/01/2023</p>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <p className="font-bold">Appointment Fee :</p>
                    <p>2000</p>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <p className="font-bold">Appointment Status :</p>
                    <button className="bg-primary text-white px-2 py-1 rounded-md">Pending</button>
                </div>


            </div>
            <ConsultationHistory />

        </div>
    );
};

export default AppointmentManagement;