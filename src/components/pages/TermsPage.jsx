import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Footer from '../sections/Footer';

const { FiFileText, FiShield, FiAlertTriangle } = FiIcons;

const TermsPage = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By purchasing, downloading, or using any digital products from FuturePath Guides, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not purchase or use our products."
    },
    {
      title: "Digital Product License",
      content: "Upon purchase, you receive a personal, non-exclusive, non-transferable license to use our digital products for individual use only. This license does not constitute a sale of the product itself, but rather a license to use it under the conditions outlined herein."
    },
    {
      title: "No Refund Policy",
      content: "ALL SALES ARE FINAL. Due to the digital nature of our products and immediate access upon purchase, we do not offer refunds under any circumstances. Please review product descriptions carefully before purchasing. By completing your purchase, you acknowledge and accept this no-refund policy."
    },
    {
      title: "Non-Shareable Content",
      content: "Our digital products are licensed for individual use only. You may NOT share, distribute, resell, reproduce, or transmit any part of our content to third parties. This includes but is not limited to: sharing download links, copying content to share with others, posting content on file-sharing platforms, or any form of unauthorized distribution."
    },
    {
      title: "Intellectual Property Rights",
      content: "All content, including but not limited to text, graphics, images, logos, and software, is the exclusive property of FuturePath Guides and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use, reproduction, or distribution of our content may result in severe civil and criminal penalties."
    },
    {
      title: "Prohibited Uses",
      content: "You agree not to: (a) reverse engineer, decompile, or disassemble any part of our products; (b) remove or alter any copyright notices or proprietary markings; (c) use our products for any illegal or unauthorized purpose; (d) share login credentials or download links with others; (e) create derivative works based on our content without written permission."
    },
    {
      title: "Account Termination",
      content: "We reserve the right to terminate your access to our products and services at any time, without notice, for conduct that violates these terms or is harmful to other users, us, or third parties, or for any other reason in our sole discretion."
    },
    {
      title: "Disclaimer of Warranties",
      content: "Our digital products are provided 'AS IS' without any warranties, express or implied. We do not guarantee specific results from using our products. Your success depends on your effort, circumstances, and various factors beyond our control."
    },
    {
      title: "Limitation of Liability",
      content: "In no event shall FuturePath Guides be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption, arising from your use of our products."
    },
    {
      title: "Governing Law",
      content: "These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction]."
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our products after changes are posted constitutes acceptance of the modified terms."
    },
    {
      title: "Contact Information",
      content: "If you have questions about these Terms of Service, please contact us at support@futurepathguides.com."
    }
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Hero Section */}
      <section className="bg-[#131319] py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SafeIcon icon={FiFileText} className="text-6xl text-[#ffffff] mx-auto mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-[#ffffff] mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-[#ffffff] leading-relaxed">
              Please read these terms carefully before purchasing or using our digital products.
            </p>
            <div className="bg-yellow-500/20 border border-yellow-400 rounded-2xl p-6 mt-8">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <SafeIcon icon={FiAlertTriangle} className="text-2xl text-yellow-400" />
                <span className="text-yellow-200 font-semibold">Important Notice</span>
              </div>
              <p className="text-yellow-100">
                By purchasing our products, you agree to our NO REFUND and NON-SHAREABLE policies.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-[#ffffff] border-b border-gray-200">
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

      {/* Terms Content */}
      <section className="py-16 bg-[#ffffff]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  className="bg-[#ffffff] rounded-2xl p-8 border border-gray-200"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-[#131319] mb-4">
                    {index + 1}. {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Key Policies Highlight */}
            <motion.div 
              className="mt-16 bg-[#ffffff] border-2 border-red-200 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <SafeIcon icon={FiShield} className="text-4xl text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#131319] mb-4">Key Policy Reminders</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="bg-[#ffffff] rounded-lg p-4 shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-red-800 mb-2">🚫 NO REFUNDS</h4>
                    <p className="text-red-700 text-sm">
                      All digital product sales are final due to immediate access upon purchase.
                    </p>
                  </div>
                  <div className="bg-[#ffffff] rounded-lg p-4 shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-red-800 mb-2">🔒 NON-SHAREABLE</h4>
                    <p className="text-red-700 text-sm">
                      Individual license only. Sharing or distributing content is prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsPage;