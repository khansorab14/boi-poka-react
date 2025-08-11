import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// import "swiper/css";

const ReviewSlider = ({ reviewData }: any) => {
  return (
    <div className="max-w-xl mx-auto  py-8">
      <h2 className="text-3xl font-serif mb-6">Reviews</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Always 1 card at a time
        loop={true}
        autoplay={{ delay: 3000 }}
      >
        {reviewData.map((review: any, index: any) => (
          <SwiperSlide key={index}>
            <div className="h-full bg-white   flex flex-col justify-between">
              <div className="text-4xl mb-2">❝</div>
              <p className="text-gray-700 text-sm mb-4 italic">
                "{review.name}"
              </p>
              <div className="mt-auto">
                <div className="text-sm font-semibold">{review.text}</div>
                <div className="text-xs text-gray-500">
                  Rating: {review.rating}/10
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
