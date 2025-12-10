// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Blog from "../components/Blog";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import { useLoading } from "../context/LoadingContext";

const Home = () => {
  const location = useLocation();
  const { loading, startLoading, stopLoading } = useLoading();

  // ensure page starts at top when this route mounts or when the route changes
  useEffect(() => {
    startLoading();
    window.scrollTo({ top: 0, behavior: "smooth" }); // change to window.scrollTo(0, 0) for instant jump
    stopLoading();
  }, [location.pathname]);

  return (
    <div>
      <Navbar />
      <Hero />
      {/* <Blog /> */}
      <FeaturedProducts />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;