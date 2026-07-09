import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import FeaturedCollection from "../components/sections/FeaturedCollection";
import HowItWorks from "../components/sections/HowItWorks";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";

const Home = () => {
  return (
    <div className="bg-[#25272c]">
      <Hero />
      <Services />
      <FeaturedCollection />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Home;
