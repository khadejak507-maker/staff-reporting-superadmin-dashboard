import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  console.log("token from pr", token);
  return <div>{token ? <Outlet /> : <Navigate to="/sign-in" />}</div>;
};

export default PrivateRoute;
