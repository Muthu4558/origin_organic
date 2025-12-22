import React from "react";
import {
    FaTruck,
    FaShippingFast,
    FaRoad,
    FaBoxOpen,
    FaLeaf,
} from "react-icons/fa";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
            <div className="text-green-600 text-xl">{icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
    </div>
);

const Shipping = () => {
    return (
        <div className="min-h-screen flex flex-col mt-20">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-grow py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <FaTruck className="text-green-600 text-5xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Delivery & Shipping
                        </h1>
                        <p className="text-gray-600 text-sm mt-3 max-w-2xl mx-auto">
                            We ensure fast, reliable, and eco-friendly delivery of your orders
                            right to your doorstep or any location of your choice.
                        </p>
                    </div>

                    {/* Sections */}
                    <Section icon={<FaShippingFast />} title="Delivery Information">
                        We deliver anywhere, anytime. You can place your order online through
                        our website or simply call us at{" "}
                        <span className="font-medium text-gray-800">
                            +91 9169166461
                        </span>{" "}
                        and get your products delivered to your doorstep or any convenient
                        location of your choice.
                    </Section>

                    <Section icon={<FaTruck />} title="Delivery Method & Process">
                        We guarantee timely delivery of your order without any hassles.
                        Orders are delivered within a maximum of{" "}
                        <span className="font-medium text-gray-800">
                            4 working days
                        </span>
                        . All shipments are handled by reputed and trusted courier companies
                        to ensure safety and reliability.
                    </Section>

                    <Section icon={<FaRoad />} title="Mode of Transport">
                        All deliveries are carried out using standard surface shipping by
                        road, ensuring cost-effective and dependable transportation of your
                        products.
                    </Section>

                    <Section icon={<FaBoxOpen />} title="Packaging">
                        We take utmost care in packaging your products to ensure they reach
                        you in perfect condition while maintaining hygiene and quality
                        standards.
                    </Section>

                    <Section icon={<FaLeaf />} title="Eco-Friendly Commitment">
                        As an environmentally conscious company, we use recyclable and
                        environment-friendly packaging materials for all deliveries to
                        reduce our carbon footprint.
                    </Section>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Shipping;