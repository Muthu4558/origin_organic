// src/components/Blog.jsx
import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "The Rise of Online Shopping in 2025",
    excerpt:
      "Explore how e-commerce is transforming the way people shop and why it's here to stay...",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRreDOuVhmRz8sTFWE7eP9zGxVQwq644CeACA&s",
    link: "#",
    tag: "Trends"
  },
  {
    title: "Top 10 Tips to Boost Your E-Commerce Sales",
    excerpt:
      "Want to scale your e-store revenue? Learn actionable tips to increase conversions and customer trust.",
    image:
      "https://cdn.prod.website-files.com/637610b6e8be873142dadb34/63e2302ae1684903276c313e_Blog-image-website-increase-sales.png",
    link: "#",
    tag: "Growth"
  },
  {
    title: "How AI is Shaping the Future of Retail",
    excerpt:
      "AI-driven recommendations and chatbots are redefining how customers experience online shopping.",
    image:
      "https://www.retailbiz.com.au/wp-content/uploads/2019/03/iStock-1067359184-1.jpg",
    link: "#",
    tag: "AI"
  }
];

const Blog = () => {
  return (
    <section
      id="blog"
      className="relative py-16 bg-gradient-to-r from-[#f8faf7] to-[#ffffff] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header (matches Hero) */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            E-Commerce <span className="text-[#6c845d]">Insights & Tips</span>
          </h2>
          <p className="mt-3 text-gray-600">
            Stay ahead of digital shopping trends — curated tips, strategy and
            fresh ideas to grow your store.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.32 }}
              className="relative bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-52">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* image overlay & tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white/80 text-sm font-semibold text-[#375a3f] px-3 py-1 rounded-full shadow-sm">
                  {blog.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{blog.excerpt}</p>

                <div className="flex items-center justify-between">
                  <a
                    href={blog.link}
                    className="inline-flex items-center gap-2 text-[#6c845d] hover:text-[#7b9b6b] font-medium"
                    aria-label={`Read more about ${blog.title}`}
                  >
                    Read more →
                  </a>

                  <div className="text-sm text-gray-500">Apr 10, 2025</div>
                </div>
              </div>

              {/* subtle accent stripe */}
              <div
                className="absolute left-0 top-0 h-full w-1 rounded-r-full"
                style={{ backgroundColor: "#6c845d" }}
                aria-hidden="true"
              />
            </motion.article>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">
            Want the latest insights delivered to your inbox?
          </p>
          <div className="inline-flex items-center gap-3 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <input
              type="email"
              placeholder="Your email address"
              className="outline-none bg-transparent px-3 py-2 text-sm w-64"
              aria-label="Email for newsletter"
            />
            <button
              className="bg-[#6c845d] hover:bg-[#7b9b6b] text-white text-sm px-4 py-2 rounded-full font-semibold transition"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;