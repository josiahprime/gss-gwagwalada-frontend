"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/gss-gwagwalada-about.jpg"
            alt="About Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col justify-end px-6 md:px-24 pb-20 text-white"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm md:text-base mb-2 tracking-wide"
          >
            HOME / ABOUT
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Our Story & Purpose
          </motion.h1>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-12 xl:px-24">
          <div className="md:flex md:items-center md:gap-12">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true }}
              className="md:w-1/2 grid grid-cols-2 gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src="https://res.cloudinary.com/djmnjen6v/image/upload/v1760550955/photo-1500595046743-cd271d694d30_ffcvyk.jpg"
                  alt="Fresh Fruits"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hidden md:block"
              >
                <Image
                  src="https://res.cloudinary.com/djmnjen6v/image/upload/v1760732096/fish_ly0uix.jpg"
                  alt="Fresh Fish"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden shadow-lg hidden md:block col-span-2"
              >
                <Image
                  src="https://res.cloudinary.com/djmnjen6v/image/upload/v1760550956/photo-1542838132-92c53300491e_wzy3c2.jpg"
                  alt="Farm Produce"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="md:w-1/2 mt-10 md:mt-0 text-gray-700"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Feeding Families, Empowering Communities
              </h2>
              <p className="mb-4 leading-relaxed">
                At <strong>Richfield Farms</strong>, we believe food should be fresh,
                sustainable, and accessible to everyone. Our mission is to bridge the
                gap between farm and table through responsible fish farming,
                innovative processing, and direct-to-consumer delivery.
              </p>
              <p className="mb-4 leading-relaxed">
                From nurturing catfish in eco-friendly ponds to providing smoked and
                fresh products across Abuja, we’re redefining local aquaculture. Our
                focus on hygiene, traceability, and technology ensures customers enjoy
                premium quality with every order.
              </p>
              <p className="leading-relaxed">
                Beyond fish, Richfield Farms is a movement — empowering local farmers,
                creating jobs, and contributing to food security in Nigeria. Every
                product we deliver represents our dedication to quality, community, and
                growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
