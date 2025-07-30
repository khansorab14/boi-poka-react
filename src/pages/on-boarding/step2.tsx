import { useNavigate } from "react-router-dom";

const Step2 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Step 2: Verify Your Information
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          We need a few more details to continue. Please confirm your identity
          and contact information.
        </p>

        <div className="text-left text-sm text-gray-600 mb-6 space-y-2">
          <p>📱 Mobile Number: **********</p>
          <p>📧 Email: ********@mail.com</p>
          <p>🪪 Government ID: Not uploaded</p>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            onClick={() => navigate("/step1")}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
