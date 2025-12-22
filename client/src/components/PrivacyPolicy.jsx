import React from "react";
import {
    FaShieldAlt,
    FaUserLock,
    FaShoppingCart,
    FaCookieBite,
    FaChartBar,
    FaServer,
    FaUsers,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <div className="text-green-600 text-xl">{icon}</div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="text-gray-600 leading-relaxed text-sm">{children}</div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-5xl mx-auto mt-30">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-3">
                        <FaShieldAlt className="text-green-600 text-5xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
                        Originorganic.in values your privacy and is committed to protecting
                        your personal, payment, and order information with the highest
                        security standards.
                    </p>
                </div>

                {/* Sections */}
                <Section
                    icon={<FaUserLock />}
                    title="User Information & Privacy"
                >
                    Originorganic.in is committed to safeguarding the information you
                    share with us. We follow strict procedures to ensure confidentiality,
                    security, and integrity of all stored data. All payment details such
                    as credit/debit card numbers, net banking, and wallet information are
                    encrypted using Secure Socket Layer (SSL) technology. Access to your
                    data is limited only to authorized employees who require it to perform
                    their duties. Any violation of privacy policies may result in strict
                    disciplinary action.
                </Section>

                <Section
                    icon={<FaShoppingCart />}
                    title="Registration & Orders"
                >
                    When registering, we collect basic details such as your email ID and
                    password. During purchase, we may collect your name, phone number,
                    email, billing and shipping address, and payment details strictly for
                    order fulfillment. These details may be shared with trusted third
                    parties like payment processors and delivery partners on a need-to-
                    know basis. We may contact you regarding order-related queries and send
                    promotional updates only if you have opted in.
                </Section>

                <Section
                    icon={<FaCookieBite />}
                    title="Use of Cookies"
                >
                    We use cookies to enhance your shopping experience and save your time.
                    Cookies help us recognize you during future visits and personalize
                    your experience. These cookies do not store any personally
                    identifiable or financial information.
                </Section>

                <Section
                    icon={<FaChartBar />}
                    title="Analytics & Report Generation"
                >
                    Originorganic.in uses analytics tools to understand website traffic
                    and improve user experience. The data collected is aggregated and
                    anonymous, ensuring that no personal or identifiable information is
                    tracked or shared.
                </Section>

                <Section
                    icon={<FaServer />}
                    title="Server Logs"
                >
                    Our servers automatically record non-personal data such as IP
                    address, browser type, operating system, referring website, visit
                    duration, and timestamps. This information is used only for internal
                    analysis to improve website performance and user experience.
                </Section>

                <Section
                    icon={<FaUsers />}
                    title="Third-Party Service Providers"
                >
                    We may engage trusted third-party service providers to host our
                    website, process payments, deliver orders, or analyze data. These
                    providers are granted limited access to your information strictly to
                    perform their services and are bound by confidentiality obligations.
                </Section>

                <Section
                    icon={<FaExclamationTriangle />}
                    title="Legal Exceptions"
                >
                    We may disclose information if required by law, court orders, or
                    governmental authorities, or to protect our rights, prevent fraud,
                    and ensure user safety. Personal data may also be transferred during
                    mergers, acquisitions, or corporate restructuring.
                </Section>

                <Section
                    icon={<FaSyncAlt />}
                    title="Changes to This Policy"
                >
                    This Privacy Policy is part of our Terms of Use. By using our website,
                    you agree to this policy. Originorganic.in reserves the right to update
                    this Privacy Policy at any time. Any changes will be communicated via
                    website updates. Our commitment to protecting your past data will
                    never be compromised without your consent.
                </Section>

                {/* Footer Note */}
                {/* <div className="text-center text-xs text-gray-500 mt-10">
                    © {new Date().getFullYear()} Originorganic.in — All Rights Reserved
                </div> */}
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
