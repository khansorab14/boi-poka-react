import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { FreeMode } from "swiper/modules";
import BookDetailModal from "./books-detail-modal";

interface Book {
  bookId: string;
  title: string;
  author: string[];
  coverImage: string;
}

interface Props {
  otherSeller: Book[];
  heading?: string;
}

const OtherBestsellers: React.FC<Props> = ({ otherSeller, heading }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

  if (!Array.isArray(otherSeller) || otherSeller.length === 0) return null;

  //   const firstAuthor = otherSeller[0]?.author?.[0] || "Unknown";

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>

      <Swiper
        breakpoints={{
          320: { slidesPerView: 1.3, spaceBetween: 12 },
          480: { slidesPerView: 2, spaceBetween: 12 },
          640: { slidesPerView: 2.5, spaceBetween: 14 },
          768: { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }}
        freeMode={true}
        modules={[FreeMode]}
        className="pb-2"
      >
        {otherSeller.map((book) => (
          <SwiperSlide
            key={book.bookId}
            className="!w-[140px] sm:!w-[160px] md:!w-[180px] lg:!w-[200px] cursor-pointer p-2"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={book.coverImage || "/assets/icons/boipoka/image.jpg"}
              alt={book.title}
              className="w-full h-44 object-cover rounded-lg border"
            />
            {/* <div className="mt-2">
              <p className="text-sm font-semibold line-clamp-2">{book.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {book.author?.join(", ") || "Unknown"}
              </p>
            </div> */}
          </SwiperSlide>
        ))}
      </Swiper>

      {showModal && selectedBook && (
        <BookDetailModal
          book={selectedBook}
          bookId={selectedBook.bookId} // ✅ pass bookId explicitly
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OtherBestsellers;
