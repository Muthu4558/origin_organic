import React from "react";
import {
    FaFileContract,
    FaUserCheck,
    FaShoppingCart,
    FaExclamationCircle,
    FaGavel,
    FaLock,
    FaSyncAlt,
    FaInfoCircle,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Section = ({ icon, title, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
            <div className="text-green-600 text-xl">{icon}</div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed space-y-2">
            {children}
        </div>
    </div>
);

const Terms = () => {
    return (
        <div className="min-h-screen flex flex-col mt-25">
            {/* Navbar */}
            <Navbar />

            {/* Content */}
            <main className="flex-grow py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <FaFileContract className="text-green-600 text-5xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-600 text-sm mt-3 max-w-3xl mx-auto">
                            Please read these Terms and Conditions carefully before using the
                            Originorganic.in website. By accessing or using our services, you
                            agree to be bound by these Terms.
                        </p>
                    </div>

                    <Section icon={<FaUserCheck />} title="Acceptance of Terms">
                        <p>
                            By accessing or using the Service, you agree to comply with and be
                            bound by these Terms. If you do not agree with any part of the
                            Terms, you do not have permission to access the Service.
                        </p>
                    </Section>

                    <Section icon={<FaInfoCircle />} title="Information Disclaimer">
                        <p>
                            This website does not provide medical advice, diagnosis, or
                            treatment. All information provided is for educational purposes
                            only and should not replace professional medical consultation.
                            Originorganic.in is not liable for any advice or treatment obtained
                            through this site.
                        </p>
                    </Section>

                    <Section icon={<FaShoppingCart />} title="Purchases">
                        <p>
                            When making a purchase, you may be required to provide payment,
                            billing, and shipping details. You represent that all information
                            provided is accurate and that you have legal rights to use the
                            payment method supplied.
                        </p>
                        <p>
                            We reserve the right to refuse or cancel orders due to availability
                            issues, pricing errors, or other reasons without prior notice.
                        </p>
                    </Section>

                    <Section
                        icon={<FaExclamationCircle />}
                        title="Availability, Errors & Inaccuracies"
                    >
                        <p>
                            Product descriptions, pricing, and availability may contain
                            inaccuracies. We reserve the right to correct errors or update
                            information at any time without prior notice.
                        </p>
                    </Section>

                    <Section icon={<FaUserCheck />} title="Accounts">
                        <p>
                            You must be at least 18 years old to create an account. You are
                            responsible for maintaining the confidentiality of your account
                            credentials and for all activities conducted under your account.
                        </p>
                    </Section>

                    <Section icon={<FaLock />} title="Intellectual Property">
                        <p>
                            All content, trademarks, logos, and intellectual property on this
                            website are the exclusive property of Originorganic.in and may not
                            be used without prior written permission.
                        </p>
                    </Section>

                    <Section icon={<FaGavel />} title="Limitation of Liability">
                        <p>
                            Originorganic.in shall not be liable for any indirect, incidental,
                            or consequential damages arising from the use or inability to use
                            the Service, including loss of data or profits.
                        </p>
                    </Section>

                    <Section icon={<FaSyncAlt />} title="Changes to Terms">
                        <p>
                            We reserve the right to modify these Terms at any time. Continued
                            use of the Service after changes become effective constitutes
                            acceptance of the revised Terms.
                        </p>
                    </Section>

                    <Section icon={<FaGavel />} title="Governing Law">
                        <p>
                            These Terms shall be governed and construed in accordance with the
                            laws of India. If any provision is deemed invalid, the remaining
                            provisions shall remain in effect.
                        </p>
                    </Section>

                    <Section icon={<FaInfoCircle />} title="Taxes & Charges">
                        <p>
                            You agree to bear all applicable taxes, duties, GST, and other
                            charges associated with purchases made through the website.
                        </p>
                    </Section>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Terms;