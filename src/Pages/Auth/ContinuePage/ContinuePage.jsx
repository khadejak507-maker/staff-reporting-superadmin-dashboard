import { Link } from "react-router-dom";

const ContinuePage = () => {
    return (
        <div className="bg-white">
            <div className="container mx-auto">
                <div className="w-full md:max-w-screen-md mx-auto flex flex-col md:flex-row justify-between items-center gap-20  ">
                    <div className="w-full md:w-[50%] order-2 md:order-1">
                        <div className=" md:h-[100vh] w-full flex flex-col items-center justify-center ">
                            <h1 className="text-xl md:text-3xl font-bold mb-6">Congratulations</h1>
                            <Link to="/">
                                <button
                                    className="bg-primary text-center w-full  p-2 font-semibold text-white px-16 py-2 rounded-2xl shadow-lg"
                                    type="submit"
                                >
                                    Continue
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-[50%] px-3 text-center order-1 md:order-2 mt-40 md:mt-0">

                        <p className="text-neutral-500 text-lg flex justify-center items-center ">Your password has been updated, please change your password regularly to avoid this happening</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContinuePage;