"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PageTitle, SectionTitle, SubsectionTitle, BodyText, SmallText, CTALink } from "../components/typography"

export default function InLifePage() {
  const [activeTab, setActiveTab] = useState("beach")

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle className="mb-8 text-center">In Life</PageTitle>

      <div className="flex flex-wrap justify-center mb-8 border-b">
        <button
          className={`px-4 py-2 mx-2 ${activeTab === "beach" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("beach")}
        >
          Beach
        </button>
        <button
          className={`px-4 py-2 mx-2 ${activeTab === "city" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("city")}
        >
          City
        </button>
        <button
          className={`px-4 py-2 mx-2 ${activeTab === "mountains" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("mountains")}
        >
          Mountains
        </button>
      </div>

      {activeTab === "beach" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[500px] md:h-[600px]">
            <Image src="/placeholder.svg?height=600&width=500" alt="Beach lifestyle" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <SectionTitle className="mb-4">Beach Life</SectionTitle>
            <BodyText className="mb-6">
              Our beach collection is inspired by the laid-back lifestyle of coastal living. Designed for comfort and
              style, these pieces transition seamlessly from sand to street.
            </BodyText>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link href="/collections/apparel" className="beach-link">
                Beach Apparel
              </Link>
              <Link href="/collections/boards/surf" className="beach-link">
                Surfboards
              </Link>
              <Link href="/collections/self-care" className="beach-link">
                Sun Care
              </Link>
              <Link href="/collections/life" className="beach-link">
                Beach Accessories
              </Link>
            </div>
            <CTALink href="/collections" className="self-start">
              Shop the Collection
            </CTALink>
          </div>

          <div className="md:col-span-2 my-12">
            <SubsectionTitle className="mb-6 text-center">Featured Beach Products</SubsectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative h-80 mb-2 overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=320&width=240&text=Beach+Product+${item}`}
                      alt={`Beach product ${item}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <SmallText className="font-normal">Beach Essential {item}</SmallText>
                  <SmallText>$99.00</SmallText>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 beach-section rounded-lg p-8 my-8">
            <SectionTitle className="mb-4 text-center">Beach Lifestyle</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <SubsectionTitle className="mb-2 text-center">Morning</SubsectionTitle>
                <BodyText>
                  Start your day with our lightweight beach robes and premium coffee accessories for the perfect sunrise
                  experience.
                </BodyText>
              </div>
              <div>
                <SubsectionTitle className="mb-2 text-center">Day</SubsectionTitle>
                <BodyText>
                  Our UV-protective apparel and premium surfboards are designed for long days under the sun.
                </BodyText>
              </div>
              <div>
                <SubsectionTitle className="mb-2 text-center">Evening</SubsectionTitle>
                <BodyText>
                  Transition to evening with our coastal-inspired casual wear and beach-to-dinner accessories.
                </BodyText>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "city" && (
        <div className="text-center py-12">
          <SectionTitle className="mb-4">City Life</SectionTitle>
          <BodyText className="max-w-2xl mx-auto">
            Coming soon! Our urban collection designed for the modern city dweller.
          </BodyText>
        </div>
      )}

      {activeTab === "mountains" && (
        <div className="text-center py-12">
          <SectionTitle className="mb-4">Mountain Life</SectionTitle>
          <BodyText className="max-w-2xl mx-auto">
            Coming soon! Our mountain collection designed for adventure seekers and nature lovers.
          </BodyText>
        </div>
      )}
    </div>
  )
}
