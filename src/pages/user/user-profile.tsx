import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../state/use-auth-store";
import { useLocation, useNavigate } from "react-router-dom"; // <-- ensures effect runs on navigation

import axiosInstance from "../../api/axios-instance";

const UserProfile = () => {
  const {
    profile,
    locationData,
    preferenceRatings,
    setProfileField,
    resetProfile,
    setLocation,
    token,
  } = useAuthStore();

  const navigate = useNavigate();

  const [age, setAge] = useState<number | null>(null);
  const location = useLocation();

  const profileData = useAuthStore((state) => state);
  console.log("UserProfile data:", profileData);

  useEffect(() => {
    const askForLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported.");
        return;
      }

      const permission = window.confirm("Allow access to your location?");
      if (!permission) {
        console.log("User denied location manually.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude);
          console.log("Location captured:", latitude, longitude);
        },
        (error) => {
          console.warn("Location access denied:", error.message);
        }
      );
    };

    askForLocation(); // run it on load or navigation
  }, [location]);

  useEffect(() => {
    if (profile.dob) {
      const birthDate = new Date(profile.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setAge(age);
    }
  }, [profile.dob]);

  const bookTypes = [
    "Fiction",
    "Non-fiction",
    "Mystery",
    "Fantasy",
    "Biography",
  ];
  const { selectedGenres } = useAuthStore.getState();

  const genreIds = selectedGenres.map((genre) => genre._id);

  const handleSubmit = async () => {
    const payload = {
      genres: genreIds,
      interests: {
        physical: preferenceRatings.physicalBook,
        ebook: preferenceRatings.eBook,
        audioBook: preferenceRatings.audioBook,
      },
      location: {
        longitude: locationData.longitude || 77.5946,
        latitude: locationData.latitude || 72.8777,
      },
      dateOfBirth: profile.dob,
      gender: profile.gender,
      howOftenYouRead: profile.readingFrequency,
      favBook: profile.favoriteBook,
      favQuote: profile.favoriteQuote,
      bookPeeve: profile.preferredBooks[0] || "",
    };

    try {
      const response = await axiosInstance.post(
        "/user/addUserProfileDetails",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile submitted successfully!");
        navigate("/create-your-library");
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      maxWidth={600}
      mx="auto"
      p={4}
      boxShadow={3}
      borderRadius={2}
      bgcolor="#fff"
    >
      <Typography variant="h5" mb={3} fontWeight="bold">
        User Profile
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Date of Birth"
          type="date"
          value={profile.dob}
          onChange={(e) => setProfileField("dob", e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        {age !== null && (
          <Typography variant="body2" color="text.secondary">
            Age: {age} years
          </Typography>
        )}

        <FormControl fullWidth>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            value={profile.gender}
            label="Gender"
            onChange={(e) => setProfileField("gender", e.target.value)}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="reading-label">How often do you read?</InputLabel>
          <Select
            labelId="reading-label"
            value={profile.readingFrequency}
            label="How often do you read?"
            onChange={(e) =>
              setProfileField("readingFrequency", e.target.value)
            }
          >
            <MenuItem value="">Select Frequency</MenuItem>
            {["Daily", "Weekly", "Monthly", "Rarely"].map((freq) => (
              <MenuItem key={freq} value={freq}>
                {freq}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Favorite Book"
          value={profile.favoriteBook}
          onChange={(e) => setProfileField("favoriteBook", e.target.value)}
          fullWidth
        />

        <TextField
          label="Favorite Quote"
          value={profile.favoriteQuote}
          onChange={(e) => setProfileField("favoriteQuote", e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="book-pref-label">Preferred Book Type</InputLabel>
          <Select
            labelId="book-pref-label"
            value={profile.preferredBooks[0] || ""}
            label="Preferred Book Type"
            onChange={(e) =>
              setProfileField("preferredBooks", [e.target.value])
            }
          >
            <MenuItem value="">Select Your Book Preference</MenuItem>
            {bookTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={resetProfile}>
            Skip
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Complete Profile
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserProfile;
