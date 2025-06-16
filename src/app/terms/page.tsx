// app/terms/page.tsx
import type { JSX } from "react";

export const metadata = {
  title: "Terms and Conditions | Zephyr Aero Leather",
  description: "Read the terms and conditions for using Zephyr Aero Leather's website and services.",
};

export default function TermsPage(): JSX.Element {
  return (
    <div className="bg-white text-gray-800 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
        <p className="mb-4 text-sm text-gray-500">Effective Date: June 6, 2025</p>

        <p className="mb-4">
          Welcome to <strong>Zephyr Aero Leather</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our website
          (https://zephyraeroleather.com), creating an account, or making a purchase, you agree to the following Terms and
          Conditions. Please read them carefully before using our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Account Registration</h2>
        <p className="mb-4">
          To place orders or view order history, you must create an account with accurate and complete information. You are
          responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
        </p>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account if you provide false information or violate these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. Orders and Payments</h2>
        <p className="mb-4">
          By placing an order, you agree to pay the listed price for the products, including any applicable taxes and shipping
          fees. All transactions are processed securely using industry-standard encryption.
        </p>
        <p className="mb-4">
          We reserve the right to cancel or refuse any order at our discretion, including due to product availability, errors in
          product or pricing information, or suspected fraud.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Shipping and Delivery</h2>
        <p className="mb-4">
          We strive to ship orders promptly, but delivery times are estimates and may vary due to carrier delays or other
          unforeseen circumstances. We are not responsible for delays once the order has been handed to the carrier.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Returns and Exchanges</h2>
        <p className="mb-4">
          We accept returns within 30 days of delivery for unused, undamaged items in original packaging. To initiate a return,
          please contact us at <a href="mailto:support@zephyraeroleather.com" className="text-blue-600 underline">support@zephyraeroleather.com</a>.
        </p>
        <p className="mb-4">
          Custom or personalized products may not be eligible for return unless they arrive damaged or defective.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Intellectual Property</h2>
        <p className="mb-4">
          All content on this website—including logos, designs, images, text, and product descriptions—is the property of Zephyr
          Aero Leather and may not be copied, reproduced, or used without prior written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Privacy</h2>
        <p className="mb-4">
          We respect your privacy. We do not sell or share your personal information with third parties. Information collected is
          used solely to fulfill your orders, provide customer service, and improve your experience on our site. We take
          reasonable steps to secure your data and only retain it as long as necessary to provide our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, Zephyr Aero Leather is not liable for any indirect, incidental, or consequential
          damages arising from the use of our site, products, or services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">8. Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws of the State of Colorado, United States, without
          regard to its conflict of law principles.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">9. Changes to These Terms</h2>
        <p className="mb-4">
          We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with an updated
          effective date. Continued use of the site constitutes your acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">10. Contact Us</h2>
        <p className="mb-4">
          For questions about these Terms, please contact us at:
        </p>
        <p className="mb-1 font-medium">Zephyr Aero Leather</p>
        <p className="mb-1">
          <a href="mailto:support@zephyraeroleather.com" className="text-blue-600 underline">support@zephyraeroleather.com</a>
        </p>
      </div>
    </div>
  );
}
