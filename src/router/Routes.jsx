import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";
import Newpass from "../Pages/Auth/NewPass/Newpass";
import VerifyPass from "../Pages/Auth/VerifyPass/VerifyPass";
import ContinuePage from "../Pages/Auth/ContinuePage/ContinuePage";

import AboutUs from "../Pages/Settings/AboutUS/AboutUs";
import PrivacyPolicy from "../Pages/Settings/PrivacyPolicy/PrivacyPolicy";
import TermsCondition from "../Pages/Settings/TermsCondition/TermsCondition";
import AdminProfile from "../Pages/AdminProfile/AdminProfile";
import Notifications from "../Pages/Notification/Notification";
import StaffDetails from "../Pages/StaffDetails/StaffDetails";
import AddClients from "../Pages/AddClients/AddClients";
import Expences from "../Pages/Expences/Expences";
import Reports from "../Pages/Reports/Reports";
import CreateStaff from "../Pages/CreateStaff/CreateStaff";
import OfficeTimeAndNotice from "../Pages/OfficeTimeAndNotice/OfficeTimeAndNotice";
import SIgnUp from "../Pages/Auth/SignUp/SIgnUp";
import CalenderComponent from "../Components/Dashboard/Calender/CalenderComponent";
import Notes from "../Components/Notes/Notes";
import ClientNotes from "../Components/ClientNotes/ClientNotes";
import AddLogoAndColor from "../Pages/Settings/AddLogoAndColor/AddLogoAndColor";

export const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SIgnUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn></SignIn>,
  },

  {
    path: "/forgate-password",
    element: <ForgatePassword></ForgatePassword>,
  },
  {
    path: "/varification",
    element: <VerifyPass></VerifyPass>,
  },

  {
    path: "/new-password",
    element: <Newpass></Newpass>,
  },
  {
    path: "/continue-page",
    element: <ContinuePage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        // element: <Analytics />,
        element: <Reports />,
      },
      // {
      //   path: "/staff-details",
      //   element: <StaffDetails />,
      // },
      // {
      //   path: "/add-client",
      //   element: <AddClients />,
      // },
      // {
      //   path: "expenses",
      //   element: <Expences />,
      // },
      // {
      //   path: "daily-report",
      //   element: <Reports />,
      // },
      // {
      //   path: "create-staff",
      //   element: <CreateStaff />,
      // },
      // {
      //   path: "office-time",
      //   element: <OfficeTimeAndNotice />,
      // },
      // {
      //   path: "/notification",
      //   element: <Notifications />,
      // },

      // setting:
      // {
      //   path: "/settings/about-us",
      //   element: <AboutUs />,
      // },
      // {
      //   path: "/settings/contact-us",
      //   element: <ContactUs />,
      // },

      // {
      //   path: "/settings/privacy-policy",
      //   element: <PrivacyPolicy />,
      // },
      // {
      //   path: "/settings/terms-condition",
      //   element: <TermsCondition />,
      // },
      // {
      //   path: "/settings/add-logo-and-color",
      //   element: <AddLogoAndColor />,
      // },
      // {
      //   path: "/staff-details/notes/:id",
      //   element: <Notes />,
      // },
      // {
      //   path: "/add-client/notes/:id",
      //   element: <ClientNotes />,
      // },

      // Admin profile:
      {
        path: "/admin-profile",
        element: <AdminProfile />,
      },
    ],
  },
]);
