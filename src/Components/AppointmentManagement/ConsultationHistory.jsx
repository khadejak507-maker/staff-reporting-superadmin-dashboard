import { act, useState } from "react";
import { AllImages } from "../../assets/image/AllImages";

const ConsultationHistory = () => {
    const [active, setActive] = useState("Video Call History");

    const toggoleActive = (value) => {
        setActive(value);
    }


    return (
        <div className="my-10">
            <h1 className="text-xl md:text-3xl font-bold mb-5">Consultation History</h1>

            {/* toggole button from call history, video call history and chat history */}


            <div className="flex justify-start items-center">
                <button onClick={() => toggoleActive("Chat History")} className={`border border-primary px-4 py-1 text-primary ${active === "Chat History" ? "bg-primary text-white" : ""}`}>Chat History</button>
                <button onClick={() => toggoleActive("Video Call History")} className={`border border-primary px-4 py-1 text-primary ${active === "Video Call History" ? "bg-primary text-white" : ""}`}>Video Call History</button>
                <button onClick={() => toggoleActive("Call History")} className={`border border-primary px-4 py-1 text-primary ${active === "Call History" ? "bg-primary text-white" : ""}`}>Call History</button>
            </div>

            {/* chat history */}

            {active === "Chat History" && <div className="bg-[#eef3f6] my-10 p-5 overflow-y-auto h-72 rounded-md">
                <p className="text-sm text-center pt-2">Today</p>
                {/* patient chat */}
                <div className="flex flex-start gap-5">
                    <div className="flex items-center gap-2">
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">Robert</p>
                            <p>Patient</p>
                        </div>
                    </div>
                    <div className="bg-neutral-300 p-3 rounded-e-xl rounded-t-xl">
                        <p>Hi john, how are you?</p>
                    </div>
                </div>
                {/* doctor chat */}
                <div className="flex justify-end  gap-5">
                    <div className="bg-neutral-300 p-3 rounded-s-xl rounded-t-xl">
                        <p>I am fine. What About you?</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="font-semibold">John Doe</p>
                            <p>Doctor</p>
                        </div>
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />

                    </div>

                </div>
                {/* patient chat */}
                <div className="flex flex-start gap-5">
                    <div className="flex items-center gap-2">
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">Robert</p>
                            <p>Patient</p>
                        </div>
                    </div>
                    <div className="bg-neutral-300 p-3 rounded-e-xl rounded-t-xl">
                        <p>Hi john, how are you?</p>
                    </div>
                </div>
                {/* doctor chat */}
                <div className="flex justify-end  gap-5">
                    <div className="bg-neutral-300 p-3 rounded-s-xl rounded-t-xl">
                        <p>I am fine. What About you?</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="font-semibold">John Doe</p>
                            <p>Doctor</p>
                        </div>
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />

                    </div>

                </div>
                {/* patient chat */}
                <div className="flex flex-start gap-5">
                    <div className="flex items-center gap-2">
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">Robert</p>
                            <p>Patient</p>
                        </div>
                    </div>
                    <div className="bg-neutral-300 p-3 rounded-e-xl rounded-t-xl">
                        <p>Hi john, how are you?</p>
                    </div>
                </div>
                {/* doctor chat */}
                <div className="flex justify-end  gap-5">
                    <div className="bg-neutral-300 p-3 rounded-s-xl rounded-t-xl">
                        <p>I am fine. What About you?</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <p className="font-semibold">John Doe</p>
                            <p>Doctor</p>
                        </div>
                        <img src={AllImages.user} alt="" className="w-10 h-10 rounded-full" />

                    </div>

                </div>
            </div>}

            {/* Video Call history */}

            {active === "Video Call History" && <div className="bg-neutral-100 p-5 rounded-lg">
                <h1>Video Call (4)</h1>
                <ul className="mt-5 list-disc list-inside">
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                </ul>
            </div>}
            {/* Audio call history */}

            {active === "Call History" && <div className="bg-neutral-100 p-5 rounded-lg">
                <h1>Audio call (4)</h1>
                <ul className="mt-5 list-disc list-inside">
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                    <li>recording 25/05/2024</li>
                </ul>
            </div>}

        </div>
    );
};

export default ConsultationHistory;