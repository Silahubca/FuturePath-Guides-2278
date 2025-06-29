import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiLock, FiEye, FiDatabase } = FiIcons;

const PrivacyPage = () => {
  const sections = [
    {
      icon: FiDatabase,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, and payment information when you make a purchase",
        "Usage Data: How you interact with our website and digital products",
        "Device Information: Browser type, operating system, and IP address",
        "Cookies: Small data files to improve your browsing experience"
      ]
    },
    {
      icon: FiEye,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your digital product orders",
        "Send purchase confirmations and download links",
        "Provide customer support and respond to inquiries",
        "Improve our products and services based on usage patterns",
        "Send occasional updates about new products (you can opt out anytime)"
      ]
    },
    {
      icon: FiShield,
      title: "Information Sharing and Disclosure",
      content: [
        "We DO NOT sell, trade, or rent your personal information to third parties",
        "Payment processing is handled by secure payment processors (Stripe, PayPal)",
        "We may disclose information if required by law or to protect our rights",
        "Service providers who help us operate our business (hosting, email services) may have access to your data under strict confidentiality agreements"
      ]
    },
    {
      icon: FiLock,
      title: "Data Security",
      content: [
        "We use industry-standard SSL encryption to protect your data",
        "Payment information is processed by PCI-compliant payment processors",
        "Access to personal information is limited to authorized personnel only",
        "Regular security assessments and updates to protect against threats"
      ]
    }
  ];

  const additionalSections = [
    {
      title: "Cookies and Tracking Technologies",
      content: "We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser, though some features may not function properly if cookies are disabled."
    },
    {
      title: "Third-Party Services",
      content: "Our website may contain links to third-party services (payment processors, social media). These services have their own privacy policies, and we are not responsible for their practices. We encourage you to review their policies before providing any information."
    },
    {
      title: "Data Retention",
      content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Purchase records are kept for tax and accounting purposes."
    },
    {
      title: "Your Rights and Choices",
      content: "You have the right to access, update, or delete your personal information. You can opt out of marketing emails at any time. For data protection requests, please contact us at privacy@futurepathguides.com."
    },
    {
      title: "Children's Privacy",
      content: "Our services are not intended for children under 13. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will delete it immediately."
    },
    {
      title: "International Users",
      content: "If you are accessing our services from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy."
    },
    {
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@futurepathguides.com or through our contact form."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SafeIcon icon={FiShield} className="text-6xl text-white mx-auto mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-600">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-blue-800 leading-relaxed">
                FuturePath Guides is committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy describes how we collect, use, and safeguard your information when you visit our website 
                and purchase our digital products.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center mb-6">
                    <SafeIcon icon={section.icon} className="text-4xl text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="text-gray-700 leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Additional Sections */}
            <div className="space-y-8">
              {additionalSections.map((section, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Privacy Highlights */}
            <motion.div 
              className="mt-16 bg-green-50 border-2 border-green-200 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <SafeIcon icon={FiLock} className="text-4xl text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-4">Your Data is Safe With Us</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">🔒 Secure Encryption</h4>
                    <p className="text-green-700 text-sm">
                      All data transmission is protected with industry-standard SSL encryption.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">🚫 No Selling</h4>
                    <p className="text-green-700 text-sm">
                      We never sell, trade, or rent your personal information to third parties.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">⚡ Your Control</h4>
                    <p className="text-green-700 text-sm">
                      You can access, update, or delete your information at any time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;