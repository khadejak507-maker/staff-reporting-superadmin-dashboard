import { Checkbox, Form, Input, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLoginMutation } from "../../../redux/Feature/auth/authApi";
const SignIn = () => {
  const [showpassword, setShowpassword] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowpassword(!showpassword);
  };

  const [login] = useLoginMutation();
  const onFinish = async (values) => {
    const userInfo = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await login(userInfo).unwrap();
      if (response?.token) {
        localStorage.setItem("token", response?.token);
        navigate("/");
      }
      message.success(response.message);
    } catch (error) {
      console.log(error);
      message.error(error?.data?.message);
    }
  };
  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <div className="w-full md:max-w-screen-md mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-20">
          <div className="w-full md:w-[50%] order-2 md:order-1">
            <div className="md:h-[100vh] w-full flex items-center justify-center ">
              <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 550 }}
                onFinish={onFinish}
                layout="vertical"
                className="py-10  md:py-28 mx-2 md:mx-0 px-6 md:px-10 rounded-2xl w-[450px] border-2 border-[#eef6ff] mt-10"
              >
                <div className="mb-4 text-center">
                  <h2 className=" text-center text-2xl md:text-3xl font-bold mb-6">
                    Login to Account
                  </h2>
                  <Typography.Text className="text-black text-center text-base ">
                    {" "}
                    Please enter your name, email and password to continue
                  </Typography.Text>
                </div>

                <Form.Item
                  name="email"
                  label={<p className=" text-md">Email</p>}
                  style={{}}
                >
                  <Input
                    required
                    style={{ padding: "6px" }}
                    className=" text-md"
                    placeholder="Your Email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={<p className=" text-md">Password</p>}
                >
                  <div className="relative flex justify-center items-center">
                    <Input
                      required
                      style={{ padding: "6px" }}
                      className=" text-md"
                      type={showpassword ? "password" : "text"}
                      placeholder="Password"
                    />
                    <div className="flex justify-center absolute right-0 px-3">
                      <button onClick={togglePasswordVisibility} type="button">
                        {showpassword ? (
                          <FaRegEyeSlash className="" />
                        ) : (
                          <FaRegEye className="" />
                        )}
                      </button>
                    </div>
                  </div>
                </Form.Item>
                <div className="flex justify-between items-center my-2">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox
                      required
                      className=" text-black text-md hover:text-black text-md"
                    >
                      Remember Password
                    </Checkbox>
                  </Form.Item>
                  <Link to="/forgate-password" className=" ">
                    <p className="text-red-600 hover:text-red-600 text-md  ">
                      Forgate Password
                    </p>
                  </Link>
                </div>
                <Form.Item className="text-center my-10">
                  <button
                    className="bg-primary text-center w-full  p-2 font-semibold  text-white px-10 py-2 rounded-2xl shadow-lg"
                    type="submit"
                  >
                    Login
                  </button>
                </Form.Item>
                <p className="text-center text-gray-500">
                  Dont have an account?{" "}
                  <span>
                    <Link to="/sign-up">Register</Link>{" "}
                  </span>{" "}
                </p>
              </Form>
            </div>
          </div>

          <div className="w-full md:w-[50%] px-3 flex flex-col justify-center items-center order-1 md:order-2 mt-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-5 md:mb-16 ">
              Welcome Back
            </h1>
            <p className="text-neutral-500 text-center text-lg ">
              Please Sign in into your account with the given details to
              continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
