import Slider from "../components/Slider";
import Header from "../layouts/Header";
//import Header from "../layouts/header";
import ServiceSection from "../components/ServiceSection";

import End from "../components/End";
import Footer from "../layouts/Footer";

const Home = () => {
  return (
    <div className="bg-white">
      <Header />
      <Slider />
      <ServiceSection />
      <End />
    </div>
  );
};

export default Home;
