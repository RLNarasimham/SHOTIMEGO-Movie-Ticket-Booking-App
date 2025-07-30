import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ArrowProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const banners = [
  {
    image:
      "https://www.supermanhomepage.com/clickandbuilds/SupermanHomepage/wp-content/uploads/2024/12/Superman-LookUp-Banner-1.png",
    link: "/promo1",
    alt: "Blockbuster movies now showing",
  },
  {
    image:
      "https://img.freepik.com/premium-psd/music-concert-banner-design-template_987701-3015.jpg",
    link: "/promo2",
    alt: "Live concerts and events this weekend",
  },
  {
    image:
      "https://img.freepik.com/free-vector/flash-sale-modern-banner-design_535749-443.jpg?size=626&ext=jpg",
    link: "/promo3",
    alt: "Get 50% off on your first booking!",
  },
];

function PrevArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 top-1/2 left-3 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors focus:outline-none"
      onClick={onClick}
      aria-label="Previous"
      type="button"
    >
      <svg
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>
  );
}

function NextArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 top-1/2 right-3 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors focus:outline-none"
      onClick={onClick}
      aria-label="Next"
      type="button"
    >
      <svg
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

const PromoBanner: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto cursor-pointer mt-4 rounded-xl overflow-hidden shadow-md relative">
      <Slider {...settings}>
        {banners.map((banner, idx) => (
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-[160px] sm:h-[230px] md:h-[300px] object-cover rounded-lg shadow"
            loading="lazy"
          />
        ))}
      </Slider>
    </div>
  );
};

export default PromoBanner;
