import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Blog from "../components/Blog";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* <Blog /> */}
      <FeaturedProducts />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
