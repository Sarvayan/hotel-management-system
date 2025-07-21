import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dheena Dayalan",
    text: "Amazing experience! The service was top-notch and the ambiance was perfect. The attention to detail made our stay truly memorable.",
    role: "Frequent Traveler",
    rating: 5
  },
  {
    name: "Manohar",
    text: "Absolutely loved the place. A must-visit for everyone! The staff went above and beyond to make our anniversary special with thoughtful touches.",
    role: "Honeymooner",
    rating: 5
  },
  {
    name: "Thooku Durai",
    text: "The views were breathtaking, and the hospitality was fantastic! Waking up to the sunrise over the mountains was worth every penny.",
    role: "Photographer",
    rating: 4
  },
];

const renderStars = (rating) => {
  return (
    <div className="flex mt-2">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const End = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col lg:flex-row gap-12 xl:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Testimonials Section */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Voices of Our Guests
              </h2>
              <p className="text-lg text-gray-600 max-w-lg">
                Hear what our valued guests have to say about their experiences at Anuthama Villa
              </p>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#d9232e] flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <blockquote className="mt-3 text-gray-700 italic">
                        "{testimonial.text}"
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="sticky top-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Discover Our Location
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                <iframe
                  className="w-full h-80 sm:h-96 lg:h-[500px]"
                  src="https://www.google.com/maps/place/Anuthama+Villa/@6.9745819,79.8896766,17z/data=!3m1!4b1!4m9!3m8!1s0x3ae2599eb56da70d:0x53256cc0bbd73f47!5m2!4m1!1i2!8m2!3d6.9745819!4d79.8896766!16s%2Fg%2F11fjvtr40t?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D"
                  allowFullScreen=""
                  loading="lazy"
                  title="Anuthama Villa Location"
                ></iframe>
              </div>
              <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Visit Us</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Address:</span> 123 Luxury Lane, Colombo, Sri Lanka
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Phone:</span> +94 123 456 789
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> info@anuthamavilla.com
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default End;