// FanFictionSlider.tsx

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronRight, Heart, User } from "lucide-react";

const FanFictionSlider = ({ fanFictionData }: any) => {
  return (
    <div className="max-w-4xl mx-auto py-12 relative">
      <h2 className="text-4xl font-serif mb-8">Fan Fiction</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: ".swiper-next",
        }}
        pagination={{ clickable: true }}
      >
        {fanFictionData.map((fic: any, index: any) => (
          <SwiperSlide key={index}>
            <div className="flex items-center justify-between border-b pb-6">
              {/* Left - Profile & Info */}
              <div className="flex items-center space-x-6">
                {/* Profile Circle */}
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10" />
                </div>

                {/* Textual Info */}
                <div>
                  <h3 className="text-xl font-bold">{fic.author}</h3>
                  <div className="text-sm underline">{fic.username}</div>
                  <div className="text-sm text-gray-500">{fic.publishedAt}</div>
                  <div className="flex items-center mt-2 space-x-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-bold">{fic.likes}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 italic">
                    {fic.short_description}
                  </p>
                </div>
              </div>

              {/* Right - Arrow and Slide Number */}
              <div className="text-right flex flex-col items-end">
                <div className="border-l h-full pl-4 flex items-center space-x-2 swiper-next cursor-pointer">
                  <ChevronRight className="w-6 h-6" />
                  <span className="font-medium text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination (handled by Swiper) */}
      <div className="mt-4 swiper-pagination flex justify-center gap-2" />
    </div>
  );
};

export default FanFictionSlider;
