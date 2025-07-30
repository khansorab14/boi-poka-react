import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios-instance";
import { useAuthStore } from "../../state/use-auth-store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, setOnboarded } = useAuthStore();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post("/user/login", values);
        const { data } = response.data;

        if (data?.token) {
          setToken(data.token);
          setOnboarded(!!data.onBoarded);

          toast.success(`✅ ${response.data.message}`, {
            autoClose: 2000,
          });

          // ✅ Redirect based on onBoarded status
          if (data.onBoarded) {
            // setOnboarded(data.onBoarded);
            console.log(data.onBoarded, "onboar from login");

            navigate("/home"); // 👈 redirect to home page
          } else {
            navigate("/welcome-screen-1"); // 👈 or onboarding flow
          }
        } else {
          toast.error("Login failed: No token received.");
        }
      } catch (error) {
        toast.error("❌ Invalid mobile number or password");
        console.error("Login failed:", error);
      }
    },
  });

  useEffect(() => {
    console.log("Component rendered or token updated");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobileNumber}
              required
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>

          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Login{" "}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
