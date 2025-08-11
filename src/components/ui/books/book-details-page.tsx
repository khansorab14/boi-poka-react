import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios-instance";
import ContentAnalysis from "./content-analysis";
import ReadingStatistics from "./reading-statistics";

import OtherBestsellers from "./other-best-seller";
import CommunitySocialMatric from "./community-social-matric";
import bookData from "../../../utils/data/powerless.json";
import BookShelfCard from "./book-shelves-card";

interface Book {
  _id: string;
  title: string;
  author: string[];
  authorOrigin?: string[];
  genre?: string[];
  coverImage?: string;
  description?: string;
  publicationYear?: number;
  estimatedTimeToRead?: number;
  numberOfChapters?: number;
  language?: string[];
  ISBN?: string[];
  bookColorScheme?: {
    startColor: string;
    middleColor: string;
    endColor: string;
    textColor: string;
  };
}

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [otherSeller, setOtherSeller] = useState<any[]>([]);
  const [quoteData, setQuoteData] = useState<any | null>(null);
  const [reader, setReader] = useState<any | null>(null);
  const [readingData, setReadingData] = useState<any | null>(null);
  const [shelvesData, setShelvesData] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookRes, authorRes] = await Promise.all([
          // axiosInstance.get(
          //   `/userbook/getBookDetails/624a3783-fb94-4d36-9940-4ed3e86f0a25`
          // ),
          axiosInstance.get(`/userbook/getBookDetails/${id}`),
          axiosInstance.get(`/book/author?bookId=${id}`),
        ]);
        setShelvesData(bookRes.data.shelves);
        setReadingData(bookRes.data.bookData);
        setBook(bookRes.data.bookData);
        setOtherSeller(authorRes.data.data || []);
      } catch (err) {
        console.error("Error fetching book details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    setQuoteData(bookData?.data?.audience?.popular_quotes);
    setReader(bookData?.data?.audience?.reader_demographics);
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!book)
    return <div className="text-center mt-10 text-red-500">Book not found</div>;

  const {
    title,
    author,
    authorOrigin,
    genre,
    coverImage,
    description,
    publicationYear,
    estimatedTimeToRead,
    numberOfChapters,
    language,
    ISBN,
  } = book;

  const charLimit = 150;
  const isLong = (description?.length ?? 0) > charLimit;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {/* Top section: Cover + Metadata */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Left: Cover image */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={coverImage || "/images/placeholder-book.png"}
            alt={title}
            className="w-44 sm:w-52 md:w-48 lg:w-56 xl:w-60 h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Metadata and Shelf */}
        <div className="flex-1 w-full relative">
          {/* Shelf card at top right */}
          <div className="absolute top-0 right-0">
            <BookShelfCard shelvesData={shelvesData} />
          </div>

          {/* Book Info */}
          <div className="pr-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-700 mt-1 mb-3">
              By {author?.join(", ")}
            </p>

            <div className="text-sm sm:text-base text-gray-600 space-y-1">
              {authorOrigin && (
                <p>
                  <strong>Author Origin:</strong> {authorOrigin.join(", ")}
                </p>
              )}
              {publicationYear && (
                <p>
                  <strong>Published:</strong> {publicationYear}
                </p>
              )}
              {genre && (
                <p>
                  <strong>Genre:</strong> {genre.join(", ")}
                </p>
              )}
              {language && (
                <p>
                  <strong>Language:</strong> {language.join(", ")}
                </p>
              )}
              {ISBN && (
                <p>
                  <strong>ISBN:</strong> {ISBN.join(", ")}
                </p>
              )}
              {numberOfChapters && (
                <p>
                  <strong>Chapters:</strong> {numberOfChapters}
                </p>
              )}
              {estimatedTimeToRead && (
                <p>
                  <strong>Estimated Reading Time:</strong> {estimatedTimeToRead}{" "}
                  mins
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800">
              Description
            </h2>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expanded ? "max-h-[1000px]" : "max-h-[120px]"
              }`}
            >
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                {expanded || !isLong
                  ? description || "No description available."
                  : `${description?.slice(0, charLimit)}...`}
              </p>
            </div>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-blue-600 hover:underline text-sm font-medium"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics & Stats */}
      <div className="mt-6 space-y-6">
        <ContentAnalysis id={id!} />
        <ReadingStatistics data={readingData} />
        <CommunitySocialMatric data={quoteData} reader={reader} />
      </div>

      {/* Other Bestsellers */}
      <div className="mt-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <OtherBestsellers
          otherSeller={[...otherSeller].reverse()}
          heading="Books Like This"
        />
      </div>

      <div className="mt-8 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <OtherBestsellers
          otherSeller={otherSeller}
          heading="Other Bestsellers by the same Author"
        />
      </div>
    </div>
  );
};

export default BookDetailsPage;
