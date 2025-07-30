import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RegisterData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType: string;
  deviceId: string;
  deviceType: string;
  notificationToken: string;
}

interface UserProfileState {
  dob: string;
  gender: string;
  readingFrequency: string;
  favoriteBook: string;
  favoriteQuote: string;
  preferredBooks: string[];
}

interface PreferenceRatings {
  physicalBook: number;
  eBook: number;
  audioBook: number;
}

interface Genre {
  _id: string;
  name: string;
  iconName: string;
  categories: string[];
}

interface AuthState {
  registerData: RegisterData;
  token: string | null;
  isOnboarded: boolean;

  currentShelf: string | null;
  setCurrentShelf: (shelf: string) => void;

  // Library
  libraryNames: string[];
  setLibraryNames: (names: string[]) => void;
  addLibraryName: (name: string) => void;
  removeLibraryName: (name: string) => void;
  deleteLibrary: (name: string) => void;

  libraryBookMap: Record<string, string[]>;
  addBooksToLibrary: (shelfName: string, bookIds: string[]) => void;

  // Book selection
  selectedBookIds: string[];
  selectBookId: (id: string) => void;
  deselectBookId: (id: string) => void;
  setSelectedBookIds: (ids: string[]) => void;
  clearSelectedBooks: () => void;

  // Uploaded image
  uploadedImage: File | null;
  uploadedImageURL: string | null;
  setUploadedImage: (file: File, url: string) => void;
  setUploadedImageURL: (url: string) => void;
  clearUploadedImage: () => void;

  // Genres
  selectedGenres: Genre[];
  setSelectedGenres: (genres: Genre[]) => void;
  addGenre: (genre: Genre) => void;
  removeGenre: (genreId: string) => void;
  clearGenres: () => void;

  // Ratings
  preferenceRatings: PreferenceRatings;
  setPreferenceRating: (type: keyof PreferenceRatings, value: number) => void;

  // Profile
  profile: UserProfileState;
  setProfileField: <K extends keyof UserProfileState>(
    key: K,
    value: UserProfileState[K]
  ) => void;
  resetProfile: () => void;

  // Location
  locationData: {
    latitude: number | null;
    longitude: number | null;
  };
  setLocation: (latitude: number, longitude: number) => void;

  // Auth flow
  setToken: (token: string) => void;
  setOnboarded: (value: boolean) => void;
  setRegisterField: (field: keyof RegisterData, value: string) => void;
  resetRegisterData: () => void;

  // 🔥 New
  selectedLibraryId: string;
  setSelectedLibraryId: (id: string) => void;
}

const defaultRegisterData: RegisterData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
  userType: "User",
  deviceId: "P1A.111111.111",
  deviceType: "IOS",
  notificationToken: "aniketsharma",
};

const defaultProfile: UserProfileState = {
  dob: "",
  gender: "",
  readingFrequency: "",
  favoriteBook: "",
  favoriteQuote: "",
  preferredBooks: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      registerData: defaultRegisterData,
      token: null,
      isOnboarded: false,

      setToken: (token) => set({ token }),
      setOnboarded: (value) => set({ isOnboarded: value }),
      setRegisterField: (field, value) =>
        set((state) => ({
          registerData: {
            ...state.registerData,
            [field]: value,
          },
        })),
      resetRegisterData: () => set({ registerData: defaultRegisterData }),

      // Uploaded image
      uploadedImage: null,
      uploadedImageURL: null,
      setUploadedImage: (file, url) =>
        set({ uploadedImage: file, uploadedImageURL: url }),
      setUploadedImageURL: (url) => set({ uploadedImageURL: url }),
      clearUploadedImage: () =>
        set({ uploadedImage: null, uploadedImageURL: null }),

      // Book selection
      selectedBookIds: [],
      selectBookId: (id) =>
        set((state) => ({
          selectedBookIds: [...state.selectedBookIds, id],
        })),
      deselectBookId: (id) =>
        set((state) => ({
          selectedBookIds: state.selectedBookIds.filter(
            (bookId) => bookId !== id
          ),
        })),
      setSelectedBookIds: (ids) => set({ selectedBookIds: ids }),
      clearSelectedBooks: () => set({ selectedBookIds: [] }),

      currentShelf: null,
      setCurrentShelf: (shelf) => set({ currentShelf: shelf }),

      // 🔥 New
      selectedLibraryId: "",
      setSelectedLibraryId: (id) => set({ selectedLibraryId: id }),

      // Genres
      selectedGenres: [],
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      addGenre: (genre) => {
        const current = get().selectedGenres;
        if (!current.find((g) => g._id === genre._id) && current.length < 3) {
          set({ selectedGenres: [...current, genre] });
        }
      },
      removeGenre: (genreId) =>
        set((state) => ({
          selectedGenres: state.selectedGenres.filter((g) => g._id !== genreId),
        })),
      clearGenres: () => set({ selectedGenres: [] }),

      // Ratings
      preferenceRatings: {
        physicalBook: 5,
        eBook: 5,
        audioBook: 5,
      },
      setPreferenceRating: (type, value) =>
        set((state) => ({
          preferenceRatings: {
            ...state.preferenceRatings,
            [type]: value,
          },
        })),

      // Profile
      profile: defaultProfile,
      setProfileField: (key, value) =>
        set((state) => ({
          profile: {
            ...state.profile,
            [key]: value,
          },
        })),
      resetProfile: () => set({ profile: defaultProfile }),

      // Location
      locationData: {
        latitude: null,
        longitude: null,
      },
      setLocation: (latitude, longitude) =>
        set({ locationData: { latitude, longitude } }),

      // Library book map
      libraryBookMap: {},
      addBooksToLibrary: (shelfName, bookIds) =>
        set((state) => ({
          libraryBookMap: {
            ...state.libraryBookMap,
            [shelfName]: [
              ...(state.libraryBookMap[shelfName] || []),
              ...bookIds,
            ],
          },
        })),
      deleteLibrary: (libraryName) =>
        set((state) => {
          const updatedMap = { ...state.libraryBookMap };
          delete updatedMap[libraryName];

          const updatedNames = state.libraryNames.filter(
            (name) => name !== libraryName
          );

          return {
            libraryBookMap: updatedMap,
            libraryNames: updatedNames,
          };
        }),

      // Library names
      libraryNames: [],
      setLibraryNames: (names) => set({ libraryNames: names }),
      addLibraryName: (name) =>
        set((state) => ({
          libraryNames: state.libraryNames.includes(name)
            ? state.libraryNames
            : [...state.libraryNames, name],
        })),
      removeLibraryName: (name) =>
        set((state) => ({
          libraryNames: state.libraryNames.filter((n) => n !== name),
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        uploadedImageURL: state.uploadedImageURL,
        selectedBookIds: state.selectedBookIds,
        libraryBookMap: state.libraryBookMap,
        libraryNames: state.libraryNames,
        isOnboarded: state.isOnboarded,
        selectedLibraryId: state.selectedLibraryId,
      }),
    }
  )
);
