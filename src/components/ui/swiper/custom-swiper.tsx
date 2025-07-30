import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import React, { ReactNode } from "react";

import "swiper/swiper-bundle.css";

export interface SwiperConfig {
  swiperConfig: SwiperOptions;
}

function SwiperComponent(props: SwiperConfig & { children: ReactNode }) {
  return (
    <Swiper
      {...props.swiperConfig}
      onBeforeSlideChangeStart={props.swiperConfig.on?.beforeSlideChangeStart}
      onSlideChange={props.swiperConfig.on?.slideChange}
      onReachEnd={props.swiperConfig.on?.reachEnd}
      onPaginationUpdate={props.swiperConfig.on?.paginationUpdate}
      onSlideChangeTransitionEnd={
        props.swiperConfig.on?.slideChangeTransitionEnd
      }
      onSlideChangeTransitionStart={
        props.swiperConfig.on?.slideChangeTransitionStart
      }
    >
      {React.Children.map(props.children, (child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperComponent;
