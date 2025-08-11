import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import DummyForm from "./pages/dummy-form/dummy-form";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Crud from "./pages/crud/crud";

import ErrorHandler from "./components/common/error-handler/error-handler";

import "react-toastify/dist/ReactToastify.css";
import Step1 from "./pages/on-boarding/step1";
import ProtectedRoute from "./components/common/protected-route/protected-route";
import Step2 from "./pages/on-boarding/step2";

import WelcomeScreen1 from "./pages/welcome-screen/welcome-screen1";
import PreferenceRatings from "./pages/welcome-screen/preference-ratings";
import UserProfile from "./pages/user/user-profile";
import CreateYourLibrary from "./pages/user/create-your-library";
import AllBooks from "./pages/user/all-books";
import BookDetailsPage from "./components/ui/books/book-details-page";
import LayoutWithSidebar from "./pages/home/layout-with-sidebar";
import BuddyLibraryView from "./pages/bottom-tab-navigation/inner-circle/fellow-pokas/buddy-library-view";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Step1 />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/home",
    element: <LayoutWithSidebar />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/welcome-screen-1",
    element: <WelcomeScreen1 />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/preference-ratings",
    element: <PreferenceRatings />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/create-your-library",
    element: <CreateYourLibrary />,
    errorElement: <ErrorHandler />,
  },
  { path: "/buddy-library/:buddyId", element: <BuddyLibraryView /> },

  {
    path: "/all-books",
    element: <AllBooks />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/books/:id",
    element: <BookDetailsPage />,
    errorElement: <ErrorHandler />,
  },

  {
    path: "/crud",
    element: (
      <ProtectedRoute>
        <Crud />
      </ProtectedRoute>
    ),
    errorElement: <ErrorHandler />,
  },
  {
    path: "/dummy-form",
    element: <DummyForm />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/step1",
    element: <Step1 />,
    errorElement: <ErrorHandler />,
  },
  {
    path: "/step2",
    element: <Step2 />,
    errorElement: <ErrorHandler />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
