"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const bannerImages = [
    {
        src: "/banner-1.jpg",
        alt: "People cooking together",
    },
    {
        src: "/banner-2.jpg",
        alt: "Delicious prepared dishes",
    },
];

export default function RotatingBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0">
            {bannerImages.map((image, index) => (
                <div
                    key={image.src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover brightness-50"
                        priority={index === 0}
                        sizes="100vw"
                    />
                </div>
            ))}
        </div>
    );
}
