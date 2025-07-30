import { useNavigate } from "react-router-dom";

const Step1 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/step2");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Welcome to BOI Poka 🚀
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Let's get started with setting up your account. This will only take a
          few minutes!
        </p>

        <ul className="text-left text-sm text-gray-600 mb-6 list-disc list-inside space-y-2">
          <li>✅ Verify your basic details</li>
          <li>✅ Add documents & identification</li>
          <li>✅ Finalize your account settings</li>
        </ul>

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
