import { useRef, useState, Fragment, useMemo, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import axiosInstance from "../../api/axios-instance";
import { useAuthStore } from "../../state/use-auth-store";
import { useNavigate } from "react-router-dom";

const CreateYourLibrary = () => {
  const { token, setUploadedImage } = useAuthStore();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[] | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const { uploadedImageURL } = useAuthStore();
  const [imageURL, setImageURL] = useState<string | null>(uploadedImageURL);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log("📦 Selected Image File:", file);
      console.log("🌐 Preview Image URL:", url);

      setImageURL(url);
      setImageFile(file);
      setUploadedImage(file, url); // Save to Zustand
    }
  };

  const handleCSVUploadClick = () => {
    csvInputRef.current?.click();
  };

  const handleCSVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row !== "")
        .map((row) => row.split(","));

      if (rows.length > 1 && rows[0].length > 1) {
        setCsvHeaders(rows[0]);
        setCsvData(rows.slice(1));
      } else {
        setCsvHeaders(null);
        setCsvData(rows);
      }
    };
    reader.readAsText(file);
  };
  const handleContinue = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axiosInstance.post("/book/ocr-book-list", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        alert("Image uploaded successfully!");
        navigate("/all-books", {
          state: {
            responseData: res.data,
          },
        });
        setOpenPreview(false);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong");
    }
  };

  const columns = useMemo(() => {
    const colSize = Math.ceil(csvData.length / 3);
    return [
      csvData.slice(0, colSize),
      csvData.slice(colSize, colSize * 2),
      csvData.slice(colSize * 2),
    ];
  }, [csvData]);
  useEffect(() => {
    if (uploadedImageURL) {
      setImageURL(uploadedImageURL);
    }
  }, [uploadedImageURL]);

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Create Your Library
      </Typography>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVChange}
        style={{ display: "none" }}
      />

      {/* Upload Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Button variant="contained" onClick={handleCaptureClick}>
          Upload Photo / Open Camera
        </Button>
        <Button variant="outlined" onClick={handleCSVUploadClick}>
          Upload CSV
        </Button>
      </Box>

      {csvData.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenPreview(true)}
        >
          Show CSV Preview
        </Button>
      )}

      {imageURL && (
        <Box mt={4}>
          <Typography variant="subtitle1">Image Preview:</Typography>
          <img
            src={imageURL}
            alt="Captured"
            style={{ width: "100%", maxWidth: 400, marginTop: 8 }}
          />
        </Box>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setOpenPreview(false)}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          disabled={!imageFile}
          onClick={handleContinue}
          className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
            imageFile
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>

      {/* Headless UI Modal */}
      <Transition appear show={openPreview} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpenPreview(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold mb-4">
                    CSV Preview
                  </Dialog.Title>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {columns.map((col, idx) => (
                      <div key={idx} className="border rounded p-2 text-sm">
                        {csvHeaders && (
                          <div className="font-semibold mb-1 text-blue-600">
                            {csvHeaders.join(" | ")}
                          </div>
                        )}
                        {col.map((row, i) => (
                          <div key={i}>{row.join(" | ")}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Box>
  );
};

export default CreateYourLibrary;
