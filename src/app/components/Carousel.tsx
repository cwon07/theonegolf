"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/0.jpeg",
  "/1.jpeg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
  "/5.jpg",
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            className="object-contain w-full h-full"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
