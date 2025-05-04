// Mock data for evaluated applications
export const mockEvaluations = [
  {
    id: "eval1",
    application_id: "2", // Corresponds to Buildex Construction
    score: 75,
    recommendation: "award",
    tender_title: "Office Renovation",
    vendor_name: "Buildex Construction",
    created_at: "2024-05-02T09:45:00Z",
    updated_at: "2024-05-02T09:45:00Z",
    evaluated_by: "ai-assistant",

    technical_evaluation: {
      total_score: 70,
      experience: {
        score: 18,
        correct: [
          "Strong portfolio of similar renovation projects",
          "10+ years of experience in commercial renovations",
          "Excellent client testimonials from previous projects",
        ],
        mistakes: ["Limited experience with eco-friendly materials", "No international project experience as required"],
      },
      team: {
        score: 25,
        correct: [
          "Qualified project manager with PMP certification",
          "Experienced design team with relevant qualifications",
          "Dedicated quality assurance personnel",
        ],
        mistakes: [
          "Team lacks specialized expertise in smart office technology",
          "No dedicated sustainability expert on the team",
        ],
      },
    },

    financial_evaluation: {
      score: 80,
      correct: [
        "Competitive pricing within budget constraints",
        "Clear breakdown of costs by category",
        "Reasonable contingency allocation",
      ],
      mistakes: ["Higher than average material costs", "Unclear payment schedule milestones"],
    },

    compliance_issues: ["Insurance certificate expires in 30 days", "Missing detailed subcontractor information"],
  },

  // Pre-generated evaluation for TechCorp Solutions (ID: 1)
  {
    id: "eval2",
    application_id: "1", // Corresponds to TechCorp Solutions
    score: 82,
    recommendation: "award",
    tender_title: "IT Equipment Supply",
    vendor_name: "TechCorp Solutions",
    created_at: "2024-05-04T10:30:00Z",
    updated_at: "2024-05-04T10:30:00Z",
    evaluated_by: "ai-assistant",

    technical_evaluation: {
      total_score: 85,
      experience: {
        score: 35,
        correct: [
          "Extensive experience supplying IT equipment to government agencies",
          "Certified partner for all major equipment manufacturers",
          "Successfully completed 5 similar projects in the last 2 years",
        ],
        mistakes: [
          "Limited experience with specialized security hardware",
          "No prior experience with the specific network infrastructure required",
        ],
      },
      team: {
        score: 28,
        correct: [
          "Certified technical team with relevant qualifications",
          "Dedicated project manager with IT infrastructure experience",
          "Specialized deployment engineers available",
        ],
        mistakes: ["Support team is smaller than recommended", "Limited cybersecurity expertise in the team"],
      },
    },

    financial_evaluation: {
      score: 78,
      correct: [
        "Competitive pricing for all equipment categories",
        "Transparent cost structure with no hidden fees",
        "Favorable payment terms offered",
      ],
      mistakes: ["Warranty costs higher than industry average", "Support package pricing lacks flexibility"],
    },

    compliance_issues: [
      "Some equipment specifications slightly below requirements",
      "Delivery timeline exceeds requested timeframe by 2 weeks",
    ],
  },

  {
    id: "eval3",
    application_id: "3", // Corresponds to Agile Consulting Group
    score: 88,
    recommendation: "award",
    tender_title: "Strategic Planning Services",
    vendor_name: "Agile Consulting Group",
    created_at: "2024-05-04T11:45:00Z",
    updated_at: "2024-05-04T11:45:00Z",
    evaluated_by: "ai-assistant",

    technical_evaluation: {
      total_score: 90,
      experience: {
        score: 32,
        correct: [
          "15+ years of strategic consulting experience",
          "Specialized expertise in public sector strategic planning",
          "Proven track record with similar organizations",
        ],
        mistakes: [
          "Limited international consulting experience",
          "No specific experience in the required industry vertical",
        ],
      },
      team: {
        score: 28,
        correct: [
          "Senior consultants with relevant advanced degrees",
          "Team includes former executives from the industry",
          "Specialized research and analytics personnel",
        ],
        mistakes: ["Project lead has less experience than required", "Team lacks technical implementation expertise"],
      },
    },

    financial_evaluation: {
      score: 85,
      correct: [
        "Competitive daily rates for all consultant levels",
        "Clear milestone-based payment structure",
        "Value-added services included at no extra cost",
      ],
      mistakes: ["Travel expenses not clearly defined", "Additional workshop costs higher than expected"],
    },

    compliance_issues: [],
  },
]
