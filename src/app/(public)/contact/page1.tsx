"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="bg-gray-100 pb-10">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="https://res.cloudinary.com/djmnjen6v/image/upload/v1760733248/contact_eaiv4t.jpg"
            alt="Contact background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="relative mx-6 md:mx-20 flex flex-col justify-end h-full pb-20 space-y-3"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <motion.h2
            className="text-sm md:text-base text-white tracking-wide"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            HOME / CONTACT
          </motion.h2>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Contact Us
          </motion.h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <motion.h2
          className="text-3xl font-bold text-[#29746b] mb-8 md:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Get in Touch
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <form className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="peer w-full px-5 pt-6 pb-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#29746b] focus:border-[#29746b] transition"
                  placeholder="Your Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#29746b]"
                >
                  Your Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="peer w-full px-5 pt-6 pb-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#29746b] focus:border-[#29746b] transition"
                  placeholder="Your Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#29746b]"
                >
                  Your Email
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  className="peer w-full px-5 pt-6 pb-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#29746b] focus:border-[#29746b] transition"
                  placeholder="Subject"
                />
                <label
                  htmlFor="subject"
                  className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#29746b]"
                >
                  Subject
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  id="message"
                  rows={5}
                  className="peer w-full px-5 pt-6 pb-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#29746b] focus:border-[#29746b] transition"
                  placeholder="Message"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-5 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#29746b]"
                >
                  Message
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                type="submit"
                className="w-full bg-[#29746b] hover:bg-[#143834] text-white font-semibold py-3 rounded-lg shadow-md transition"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#29746b] mb-4">
                Contact Information
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> Behind Forest Hotel, Chukuku Village,
                Along Kuje Road, FCT Abuja, Nigeria
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> +234 903 430 7204, +234 802 759 4643
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> richfieldfarmsandsmoke@gmail.com
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#29746b] mb-4">
                Business Hours
              </h3>
              <div className="text-gray-700 text-sm space-y-2">
                <p>
                  <strong>Mon - Fri:</strong> 9:00 AM - 6:00 PM
                </p>
                <p>
                  <strong>Saturday:</strong> 10:00 AM - 4:00 PM
                </p>
                <p>
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
