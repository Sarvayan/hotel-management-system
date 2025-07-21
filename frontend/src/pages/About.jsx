import { motion } from "framer-motion";
import hotelHero from "../assets/images/gallery2.jpg";
import luxuryRoom from "../assets/images/service1.png";
import fineDining from "../assets/images/gallery5.jpg";
import eventSpace from "../assets/images/service2.jpg";
import adminBg from "../assets/images/admin-bg3.jpg";

const About = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-96 md:h-screen max-h-[800px] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${adminBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        >
          
        </div>

        <motion.div
          className="relative z-10 h-full flex flex-col justify-center text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to <span className="text-gold-400">WeAre Villa</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Where luxury meets comfort in an unforgettable experience
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* About Section */}
          <section className="mb-24">
            <motion.div
              className="flex flex-col lg:flex-row gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our <span className="text-blue-600">Story</span>
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Founded in 2005, WeAre Villa has been redefining luxury
                  hospitality with our commitment to excellence and attention to
                  detail. What began as a small boutique hotel has grown into an
                  award-winning destination known for its impeccable service and
                  stunning architecture.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our philosophy centers around creating meaningful experiences
                  for each guest, blending modern sophistication with timeless
                  elegance in every aspect of your stay.
                </p>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 w-full">
                  <img
                    src={hotelHero}
                    alt="WeAre Villa exterior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-600 opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-400 rounded-lg shadow-xl hidden lg:block" aria-hidden="true"></div>
              </div>
            </motion.div>
          </section>

          {/* Mission Section */}
          <section className="mb-24">
            <motion.div
              className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-700 rounded-full opacity-20" aria-hidden="true"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20" aria-hidden="true"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our <span className="text-yellow-300">Mission</span>
                </h2>
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-4xl">
                  To create extraordinary experiences by anticipating every need,
                  exceeding expectations, and crafting memories that last a
                  lifetime through our unparalleled service and attention to
                  detail.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Excellence",
                      description: "Setting the highest standards in hospitality"
                    },
                    {
                      title: "Innovation",
                      description: "Continually evolving to enhance your experience"
                    },
                    {
                      title: "Community",
                      description: "Supporting and engaging with our local area"
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                      <h3 className="text-xl font-semibold mb-3 text-yellow-300">
                        {item.title}
                      </h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Services Section */}
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <header className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our <span className="text-blue-600">Services</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the exceptional amenities and services that make us the
                  premier choice for discerning travelers
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Luxury Accommodations",
                    image: luxuryRoom,
                    alt: "Luxury Room",
                    description: "Our meticulously designed rooms and suites blend contemporary elegance with ultimate comfort, featuring premium bedding, state-of-the-art technology, and breathtaking views.",
                    features: [
                      "Plush king-size beds",
                      "Smart room controls",
                      "24/7 room service"
                    ]
                  },
                  {
                    title: "Culinary Excellence",
                    image: fineDining,
                    alt: "Fine Dining",
                    description: "Experience gastronomic delights at our award-winning restaurants, where world-class chefs create innovative dishes using locally-sourced, seasonal ingredients.",
                    features: [
                      "Michelin-starred dining",
                      "Wine pairing experiences",
                      "Private chef's table"
                    ]
                  },
                  {
                    title: "Event Spaces",
                    image: eventSpace,
                    alt: "Event Space",
                    description: "Host unforgettable events in our versatile venues, supported by our expert event planners and state-of-the-art technology for flawless execution.",
                    features: [
                      "Customizable ballrooms",
                      "Advanced AV systems",
                      "Dedicated event coordinators"
                    ]
                  }
                ].map((service, index) => (
                  <motion.article
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.alt}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {service.description}
                      </p>
                      <ul className="text-gray-600 space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg
                              className="w-5 h-5 text-blue-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Contact Section */}
          <section>
            <motion.div
              className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Experience <span className="text-yellow-400">WeAre Villa</span>
                  </h2>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    Our concierge team is available 24/7 to assist with
                    reservations, special requests, or any questions you may have
                    about your upcoming stay.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        icon: (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        ),
                        title: "Reservations",
                        content: (
                          <a
                            href="tel:+94123456789"
                            className="text-yellow-400 hover:text-yellow-300 text-xl"
                          >
                            +94 123 456 789
                          </a>
                        )
                      },
                      {
                        icon: (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        ),
                        title: "Email",
                        content: (
                          <a
                            href="mailto:info@wearevilla.com"
                            className="text-yellow-400 hover:text-yellow-300 text-xl"
                          >
                            info@wearevilla.com
                          </a>
                        )
                      },
                      {
                        icon: (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </>
                        ),
                        title: "Address",
                        content: "123 Luxury Avenue, Colombo, Sri Lanka"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg
                            className="w-6 h-6 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {item.icon}
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-lg font-medium">{item.title}</p>
                          <div className="text-gray-300">
                            {item.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;