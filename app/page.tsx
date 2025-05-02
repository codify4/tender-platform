import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  FileCheck,
  Shield,
  Users,
  BarChart3,
  Award,
  ChevronRight,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e6edf7]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-[#1a3c70] font-bold text-xl">AADF Procurement</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#1a3c70] transition-colors">
                Features
              </a>
              <a href="#vendor-process" className="text-gray-700 hover:text-[#1a3c70] transition-colors">
                Vendor Process
              </a>
              <a href="#evaluation" className="text-gray-700 hover:text-[#1a3c70] transition-colors">
                Evaluation
              </a>
            </nav>
            <div>
              <Button className="bg-[#1a3c70] hover:bg-[#132d54] text-white">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a3c70] to-[#2a4d81] text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Streamline Your Procurement Process</h1>
              <p className="text-xl mb-8 text-blue-100">
                AI-powered platform that simplifies tender management, evaluation, and compliance for AADF projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#d42e4e] hover:bg-[#b82642] text-white">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3">
                  <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-[#1a3c70] mb-4" />
                      <p className="text-gray-500">Evaluation Dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-xl p-6 transform -rotate-2 z-20 w-48">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">AI Compliance Check</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#e6edf7] to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#e6edf7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers comprehensive tools to manage the entire procurement lifecycle with AI-powered
              validation and evaluation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Tender Management",
                description: "Create templates, set deadlines, and send automatic notifications to vendors.",
                icon: FileCheck,
                delay: 0,
              },
              {
                title: "Vendor Registration",
                description: "Streamlined uploads for company info, financial offers, contracts, and licenses.",
                icon: Users,
                delay: 0.1,
              },
              {
                title: "AI Compliance Check",
                description: "Validates documents, licenses, and contract similarity automatically.",
                icon: Shield,
                delay: 0.2,
              },
              {
                title: "AI Pre-Scoring",
                description: "Extracts key data and validates contract values against requirements.",
                icon: Award,
                delay: 0.3,
              },
              {
                title: "Scoring Dashboard",
                description: "Digital scorecards with real-time updates, comments, and audit logs.",
                icon: BarChart3,
                delay: 0.4,
              },
              {
                title: "Auto Evaluation Reports",
                description: "Generate comprehensive reports with scores, rankings, and justifications.",
                icon: FileCheck,
                delay: 0.5,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-none bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-[#1a3c70]/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-[#1a3c70]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1a3c70]">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Process Section */}
      <section id="vendor-process" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">Vendor Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A streamlined experience for vendors to submit and track their bids with complete transparency.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#1a3c70]/20 hidden md:block"></div>

            {[
              {
                title: "Registration",
                description: "Create an account and verify your company details to access available tenders.",
                isLeft: true,
                delay: 0,
              },
              {
                title: "Document Preparation",
                description: "Upload required documents including business registration, licenses, and team CVs.",
                isLeft: false,
                delay: 0.2,
              },
              {
                title: "Bid Submission",
                description: "Submit your technical and financial proposals through our secure encrypted portal.",
                isLeft: true,
                delay: 0.4,
              },
              {
                title: "Status Tracking",
                description: "Monitor your submission status in real-time with notifications at each stage.",
                isLeft: false,
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: step.isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className={`relative mb-12 md:mb-24 ${step.isLeft ? "md:pr-12 md:text-right md:ml-0 md:mr-auto" : "md:pl-12 md:ml-auto md:mr-0"} md:w-5/12`}
              >
                <div
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-[#d42e4e] relative ${step.isLeft ? "" : ""}`}
                >
                  <div className="absolute top-6 hidden md:block" style={step.isLeft ? { right: "-42px" } : { left: "-42px" }}>
                    <div className="rounded-full bg-[#1a3c70] text-white w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#1a3c70] md:hidden flex items-center">
                    <span className="rounded-full bg-[#1a3c70] text-white w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>
                  <h3 className="text-xl font-semibold mb-2 text-[#1a3c70] hidden md:block">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Process Section */}
      <section id="evaluation" className="py-20 bg-[#e6edf7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3c70] mb-4">AADF Evaluation Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform transforms the evaluation process with AI-powered tools that ensure fairness and efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-[#1a3c70]">Evaluation Criteria</h3>
                <div className="space-y-4">
                  {[
                    { label: "Financial Bid", value: "35%" },
                    { label: "Relevant Experience", value: "30%" },
                    { label: "Team Qualifications", value: "25%" },
                    { label: "Urban Trails Experience", value: "10%" },
                  ].map((criteria, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{criteria.label}</span>
                      <div className="w-1/2">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: criteria.value }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 * index }}
                            className="h-full rounded-full bg-[#1a3c70]"
                          ></motion.div>
                        </div>
                      </div>
                      <span className="text-[#1a3c70] font-semibold">{criteria.value}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4 text-[#1a3c70]">Disqualification Factors</h3>
                <ul className="space-y-2">
                  {[
                    "Missing required licenses (e.g., Urban Planner 1b)",
                    "No similar projects in portfolio",
                    "Less than 70% overall score",
                    "Less than 60% in any category",
                  ].map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-4 h-4 rounded-full bg-[#d42e4e]"></div>
                      </div>
                      <span className="ml-3 text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6">
                {[
                  {
                    title: "AI Document Validation",
                    description:
                      "Our system automatically checks for required licenses, validates contract values, and ensures all documentation is complete.",
                    icon: Shield,
                  },
                  {
                    title: "Objective Scoring",
                    description:
                      "Digital scorecards eliminate bias and human error, with AI-assisted scoring suggestions based on clear criteria.",
                    icon: Award,
                  },
                  {
                    title: "Comprehensive Audit Trail",
                    description:
                      "Every evaluation action is logged, creating a transparent record for review and compliance purposes.",
                    icon: FileCheck,
                  },
                ].map((item, index) => (
                  <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="rounded-full bg-[#1a3c70]/10 p-3 w-12 h-12 flex items-center justify-center">
                            <item.icon className="h-6 w-6 text-[#1a3c70]" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-[#1a3c70]">{item.title}</h4>
                          <p className="text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a3c70] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Procurement Process?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join organizations that have streamlined their tender management and evaluation with our AI-powered
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#d42e4e] hover:bg-[#b82642] text-white">
                Sign Up as Vendor
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Sign Up as Staff
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2547] text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">eProcure</h3>
              <p className="text-blue-200 mb-4">
                Streamlining the procurement process with AI-powered tools for efficiency and compliance.
              </p>
              <div className="flex space-x-4">
                <Link href="https://x.com/the_aadf" target="_blank" className="text-white hover:text-[#d42e4e] transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://al.linkedin.com/company/aadf" target="_blank" className="text-white hover:text-[#d42e4e] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="https://www.instagram.com/the_aadf" target="_blank" className="text-white hover:text-[#d42e4e] transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-blue-200 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" /> Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#vendor-process"
                    className="text-blue-200 hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" /> Vendor Process
                  </Link>
                </li>
                <li>
                  <Link href="#evaluation" className="text-blue-200 hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" /> Evaluation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">References</h3>
              <Link href="https://www.aadf.org/" target="_blank" className="text-blue-200">AADF Website</Link>
              <Link href="mailto:info@aadf.org" className="text-blue-200">info@aadf.org</Link>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>© {new Date().getFullYear()} eProcure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}