"use client"

import Link from "next/link";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Meteors } from "@/components/magicui/meteors";
import { useRef } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c70]/90 to-[#1a3c70]/80 z-0"></div>
        <Meteors number={20} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Procurement. Digitized. <span className="text-[#d42e4e]">Done Right.</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              The complete procurement management platform built for the Albanian-American Development Foundation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signin">
                <ShimmerButton className="px-8 py-3 bg-[#d42e4e] text-white font-medium rounded-lg hover:bg-[#d42e4e]/90 transition-colors">
                  Request Access
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">
              Transforming Procurement Challenges
            </h2>
            <p className="text-lg text-gray-700">
              Our platform addresses the key pain points in the procurement process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-3">The Problem</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#d42e4e] mr-3">✕</span>
                  <span className="text-gray-700">Time-consuming manual evaluations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d42e4e] mr-3">✕</span>
                  <span className="text-gray-700">Documentation errors and inconsistencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d42e4e] mr-3">✕</span>
                  <span className="text-gray-700">Lack of transparency and audit trails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d42e4e] mr-3">✕</span>
                  <span className="text-gray-700">Inefficient reporting procedures</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-3">Our Solution</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">AI-powered evaluation that reduces processing time by 60%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Standardized workflows ensuring compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Complete audit trail and transparency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">Automated reporting with one-click generation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">
              Feature Highlights
            </h2>
            <p className="text-lg text-gray-700">
              Everything you need to streamline your procurement process
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1a3c70]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a3c70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-2">Tender Publishing</h3>
              <p className="text-gray-600">Create and publish tenders with standardized templates and workflows</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1a3c70]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a3c70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-2">Secure Submissions</h3>
              <p className="text-gray-600">Encrypted vendor portal for secure and confidential bid submissions</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1a3c70]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a3c70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-2">AI-Assisted Evaluation</h3>
              <p className="text-gray-600">Intelligent proposal analysis to identify the best vendors quickly</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#1a3c70]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a3c70]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-2">Report Automation</h3>
              <p className="text-gray-600">Generate comprehensive reports with just one click</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-700">
              A simple three-step process to transform your procurement
            </p>
          </div>
          
          <div className="relative flex flex-col md:flex-row max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="flex-1 text-center px-6 mb-8 md:mb-0 relative" id="step1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a3c70] text-white text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-3">Upload Tender</h3>
              <p className="text-gray-600">Create and publish your tender with our standardized templates</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex-1 text-center px-6 mb-8 md:mb-0 relative" id="step2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a3c70] text-white text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-3">Evaluate</h3>
              <p className="text-gray-600">Collect and assess vendor submissions with AI assistance</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex-1 text-center px-6" id="step3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a3c70] text-white text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold text-[#1a3c70] mb-3">Finalize</h3>
              <p className="text-gray-600">Award contracts and generate comprehensive reports</p>
            </div>
            
            {/* Animated Beams - Client-side only */}
            <ClientBeams />
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">
              Trusted By Organizations
            </h2>
            <p className="text-lg text-gray-700">
              See what our clients say about our platform
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-xl p-8 max-w-3xl mx-auto hover:shadow-lg transition-all duration-300">
            <div className="italic text-gray-700 mb-4">
              "The procurement platform has transformed our tender process, saving us countless hours of manual work while improving transparency and compliance."
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold text-[#1a3c70]">Name Placeholder</div>
                <div className="text-sm text-gray-600">Organization Placeholder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a3c70]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Procurement Process?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join the Albanian-American Development Foundation and other organizations in modernizing procurement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin">
                <ShimmerButton className="px-8 py-3 bg-[#d42e4e] text-white font-medium rounded-lg hover:bg-[#d42e4e]/90 transition-colors">
                  Start Now
                </ShimmerButton>
              </Link>
              <Link href="/contact">
                <ShimmerButton className="px-8 py-3 bg-white text-[#1a3c70] font-medium rounded-lg hover:bg-white/90 transition-colors">
                  Contact Us
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold text-[#1a3c70]">Tender Platform</div>
              <div className="text-sm text-gray-600">© {new Date().getFullYear()} Albanian-American Development Foundation</div>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-600 hover:text-[#1a3c70]">Terms</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#1a3c70]">Privacy</Link>
              <Link href="/contact" className="text-gray-600 hover:text-[#1a3c70]">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ClientBeams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {containerRef.current && step1Ref.current && step2Ref.current && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={step1Ref}
          toRef={step2Ref}
          curvature={-20}
          duration={3}
          gradientStopColor="#d42e4e"
          gradientStartColor="#1a3c70"
        />
      )}
      {containerRef.current && step2Ref.current && step3Ref.current && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={step2Ref}
          toRef={step3Ref}
          curvature={-20}
          duration={3}
          gradientStopColor="#d42e4e"
          gradientStartColor="#1a3c70"
        />
      )}
      
      {/* References to steps */}
      <div ref={step1Ref} className="absolute top-4 left-[16.6%]" />
      <div ref={step2Ref} className="absolute top-4 left-[50%]" />
      <div ref={step3Ref} className="absolute top-4 left-[83.3%]" />
    </div>
  );
}
