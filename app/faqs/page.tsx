"use client"

import { useState } from "react"
import Layout from "../components/layout"

export default function FAQsPage() {
  const [openSection, setOpenSection] = useState<string | null>("ordering")

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const faqs = {
    ordering: [
      {
        question: "How do I place an order?",
        answer:
          "You can place an order through our website by browsing our collections, selecting your desired items, adding them to your cart, and proceeding to checkout. You'll need to create an account or check out as a guest, provide shipping and payment information, and confirm your order.",
      },
      {
        question: "Can I modify or cancel my order after it's been placed?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this window, orders are processed for shipping and cannot be modified or canceled. Please contact us as soon as possible if you need to make changes.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available to your country during checkout.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secure and encrypted.",
      },
      {
        question: "Do you offer gift wrapping?",
        answer:
          "Yes, we offer gift wrapping for a small additional fee. You can select this option during checkout and include a personalized message for the recipient.",
      },
    ],
    products: [
      {
        question: "How do I find my size?",
        answer:
          "We provide detailed size guides for all our products. You can find the size guide on each product page. If you're between sizes or have specific questions about fit, please contact our customer service team for assistance.",
      },
      {
        question: "Are your products sustainable?",
        answer:
          "Yes, sustainability is at the core of our brand. We use organic, recycled, and responsibly sourced materials whenever possible. Each product page includes information about the materials used and our sustainability practices.",
      },
      {
        question: "How should I care for my EC products?",
        answer:
          "Care instructions vary by product. You can find specific care information on the product page and on the care label of each item. Generally, we recommend washing in cold water, avoiding bleach, and air drying when possible to extend the life of your products and reduce environmental impact.",
      },
      {
        question: "Do you offer custom or personalized products?",
        answer:
          "We offer customization for select products, including surfboards and some apparel items. Please check the product description or contact our customer service team for customization options.",
      },
      {
        question: "Are your products unisex?",
        answer:
          "Many of our products are designed to be unisex or gender-neutral. We believe in creating products that can be enjoyed by everyone, regardless of gender. Product descriptions will indicate if an item is specifically designed for men or women.",
      },
    ],
    shipping: [
      {
        question: "How long will it take to receive my order?",
        answer:
          "Domestic orders typically ship within 1-2 business days and arrive within 3-7 business days, depending on your location and shipping method selected. International orders may take 7-21 business days to arrive, depending on the destination country and customs processing.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website or directly through the carrier's website.",
      },
      {
        question: "Do you ship to P.O. boxes?",
        answer:
          "Yes, we can ship to P.O. boxes for standard shipping methods. However, expedited shipping options may require a physical address.",
      },
      {
        question: "What if my package is lost or damaged?",
        answer:
          "If your package is lost, damaged, or shows signs of tampering, please contact our customer service team immediately. We'll work with the shipping carrier to locate your package or process a replacement or refund.",
      },
      {
        question: "Are there any additional fees for international shipping?",
        answer:
          "International orders may be subject to import duties, taxes, and customs fees, which are the responsibility of the recipient. These fees are not included in the purchase price or shipping cost and are collected by the delivery carrier or customs office.",
      },
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most items in new, unworn condition with original tags attached. Custom or personalized items, swimwear, and sale items marked as final sale are not eligible for return.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To initiate a return, log into your account, go to your order history, select the order containing the item(s) you wish to return, and follow the return instructions. You can also contact our customer service team for assistance.",
      },
      {
        question: "Do you offer free returns?",
        answer:
          "We offer free returns for domestic orders. International returns are accepted, but the customer is responsible for return shipping costs.",
      },
      {
        question: "How long does it take to process a return?",
        answer:
          "Once we receive your return, it typically takes 3-5 business days to process. Refunds are issued to the original payment method and may take an additional 3-7 business days to appear on your statement, depending on your financial institution.",
      },
      {
        question: "Can I exchange an item instead of returning it?",
        answer:
          "Yes, you can exchange items for a different size or color, subject to availability. To request an exchange, follow the same process as initiating a return and select the exchange option.",
      },
    ],
    account: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking the 'Account' icon in the top right corner of our website and selecting 'Create Account'. You'll need to provide your email address and create a password. You can also create an account during the checkout process.",
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click the 'Account' icon, select 'Sign In', and then click 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password.",
      },
      {
        question: "How can I update my account information?",
        answer:
          "Log into your account, go to 'Account Settings', and you can update your personal information, shipping addresses, payment methods, and communication preferences.",
      },
      {
        question: "Can I view my order history?",
        answer:
          "Yes, you can view your complete order history by logging into your account and selecting 'Order History'. From there, you can view details of past orders, track current orders, and initiate returns.",
      },
      {
        question: "How do I subscribe or unsubscribe from emails?",
        answer:
          "You can manage your email preferences by logging into your account, going to 'Communication Preferences', and selecting which types of emails you'd like to receive. You can also unsubscribe from marketing emails by clicking the 'Unsubscribe' link at the bottom of any email we send.",
      },
    ],
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Surfboard on beach"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Frequently Asked Questions</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Find answers to common questions about our products, ordering, shipping, and more.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* FAQ Categories */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => toggleSection("ordering")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  openSection === "ordering" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Ordering
              </button>
              <button
                onClick={() => toggleSection("products")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  openSection === "products" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => toggleSection("shipping")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  openSection === "shipping" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Shipping
              </button>
              <button
                onClick={() => toggleSection("returns")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  openSection === "returns" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Returns & Exchanges
              </button>
              <button
                onClick={() => toggleSection("account")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  openSection === "account" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Account & Orders
              </button>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-6">
              {openSection &&
                Object.entries(faqs).map(
                  ([category, questions]) =>
                    category === openSection && (
                      <div key={category} className="space-y-4">
                        {questions.map((faq, index) => (
                          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-light text-primary">{faq.question}</h3>
                            <p className="mt-4 text-primary">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    ),
                )}
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-light text-primary">Still have questions?</h2>
              <p className="mt-4 text-primary">
                If you couldn't find the answer to your question, our customer service team is here to help.
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
