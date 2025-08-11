import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axios-instance";
import { useAuthStore } from "../../state/use-auth-store";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { setRegisterField } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      userType: "User",
      deviceId: "P1A.111111.111",
      deviceType: "IOS",
      notificationToken: "aniketsharma",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      deviceId: Yup.string().required("Device ID is required"),
      notificationToken: Yup.string().required(
        "Notification Token is required"
      ),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Registering with values:", values);

        Object.entries(values).forEach(([field, value]) =>
          setRegisterField(field as keyof typeof values, value)
        );

        const response = await axiosInstance.post("/user/register", values);
        console.log("Register API response:", response);

        const token = response.data?.token;
        if (token) {
          // Optional: setToken(token); — if you want to stay logged in
          console.log("Registered successfully, token:", token);
        }

        navigate("/login");
      } catch (error: any) {
        console.error("Registration failed:", error);
        alert("Registration failed: " + error.message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Mobile Number", name: "mobileNumber", type: "tel" },
            { label: "Password", name: "password", type: "password" },
            // { label: "Device ID", name: "deviceId", type: "text" },
            // {
            //   label: "Notification Token",
            //   name: "notificationToken",
            //   type: "text",
            // },
          ].map((field) => (
            <div className="text-left" key={field.name}>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={(formik.values as any)[field.name]}
              />
              {formik.touched[field.name as keyof typeof formik.touched] &&
                formik.errors[field.name as keyof typeof formik.errors] && (
                  <div className="text-red-500 text-sm mt-1">
                    {(formik.errors as any)[field.name]}
                  </div>
                )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
