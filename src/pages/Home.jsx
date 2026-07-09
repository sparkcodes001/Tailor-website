import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import FeaturedCollection from "../components/sections/FeaturedCollection";

const Home = () => {
  return (
    <div className="bg-[#25272c]">
      <Hero />
      <Services />
      <FeaturedCollection />
    </div>
  );
};

export default Home;
