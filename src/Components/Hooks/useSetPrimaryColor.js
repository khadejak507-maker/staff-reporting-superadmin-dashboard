/* eslint-disable no-unused-vars */
// hooks/useSetPrimaryColorFromToken.js
import { useEffect } from "react";
import { useGetLogoAndColorQuery } from "../../redux/Feature/seetingsApi/seetingsApi";

const useSetPrimaryColorFromToken = () => {
  const { data: companyColor, refetch } = useGetLogoAndColorQuery();
  console.log("companyColor", companyColor);
  const colorfromCompany = companyColor?.data?.color;
  console.log(colorfromCompany);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // const color = payload.bgColor;
        const color = colorfromCompany;
        if (color) {
          document.documentElement.style.setProperty("--color-primary", color);
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, [colorfromCompany]);
};

export default useSetPrimaryColorFromToken;
