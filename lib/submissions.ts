// Mock data for submissions
export const mockSubmissions = [
    {
      id: "1",
      vendor_id: "v001",
      tender_id: "t001",
      submission_id: "sub001",
      status: "pending",
      created_at: "2024-05-01T10:30:00Z",
      updated_at: "2024-05-01T10:30:00Z",
  
      // Additional fields for UI display
      vendor_name: "TechCorp Solutions",
      tender_title: "IT Equipment Supply",
      tender_reference: "ITT-2024-001",
      score: null,
      documents: [
        {
          id: "doc1",
          name: "Technical Proposal.pdf",
          type: "pdf",
          size: "2.4MB",
        },
        {
          id: "doc2",
          name: "Financial Proposal.xlsx",
          type: "xlsx",
          size: "1.2MB",
        },
        {
          id: "doc3",
          name: "Company Profile.pdf",
          type: "pdf",
          size: "3.7MB",
        },
      ],
      criteria: [
        {
          id: "crit1",
          title: "Technical Capability",
          weight: 40,
          maxScore: 40,
        },
        {
          id: "crit2",
          title: "Financial Proposal",
          weight: 30,
          maxScore: 30,
        },
        {
          id: "crit3",
          title: "Experience & References",
          weight: 20,
          maxScore: 20,
        },
        {
          id: "crit4",
          title: "Delivery Timeline",
          weight: 10,
          maxScore: 10,
        },
      ],
    },
    {
      id: "2",
      vendor_id: "v002",
      tender_id: "t002",
      submission_id: "sub002",
      status: "pending",
      created_at: "2024-04-28T14:15:00Z",
      updated_at: "2024-05-02T09:45:00Z",
  
      // Additional fields for UI display
      vendor_name: "Buildex Construction",
      tender_title: "Office Renovation",
      tender_reference: "ITT-2024-002",
      score: 75,
      documents: [
        {
          id: "doc4",
          name: "Renovation Proposal.pdf",
          type: "pdf",
          size: "5.1MB",
        },
        {
          id: "doc5",
          name: "Cost Breakdown.xlsx",
          type: "xlsx",
          size: "0.9MB",
        },
        {
          id: "doc6",
          name: "Project Timeline.pdf",
          type: "pdf",
          size: "1.5MB",
        },
      ],
      criteria: [
        {
          id: "crit5",
          title: "Design Quality",
          weight: 35,
          maxScore: 35,
        },
        {
          id: "crit6",
          title: "Cost Effectiveness",
          weight: 30,
          maxScore: 30,
        },
        {
          id: "crit7",
          title: "Project Timeline",
          weight: 20,
          maxScore: 20,
        },
        {
          id: "crit8",
          title: "Previous Work",
          weight: 15,
          maxScore: 15,
        },
      ],
    },
    {
      id: "3",
      vendor_id: "v003",
      tender_id: "t003",
      submission_id: "sub003",
      status: "pending",
      created_at: "2024-05-03T11:20:00Z",
      updated_at: "2024-05-03T11:20:00Z",
  
      // Additional fields for UI display
      vendor_name: "Agile Consulting Group",
      tender_title: "Strategic Planning Services",
      tender_reference: "ITT-2024-003",
      score: null,
      documents: [
        {
          id: "doc7",
          name: "Consulting Proposal.pdf",
          type: "pdf",
          size: "3.2MB",
        },
        {
          id: "doc8",
          name: "Team Profiles.pdf",
          type: "pdf",
          size: "4.5MB",
        },
        {
          id: "doc9",
          name: "Pricing Structure.xlsx",
          type: "xlsx",
          size: "0.8MB",
        },
      ],
      criteria: [
        {
          id: "crit9",
          title: "Methodology",
          weight: 35,
          maxScore: 35,
        },
        {
          id: "crit10",
          title: "Team Expertise",
          weight: 30,
          maxScore: 30,
        },
        {
          id: "crit11",
          title: "Cost",
          weight: 25,
          maxScore: 25,
        },
        {
          id: "crit12",
          title: "Timeline",
          weight: 10,
          maxScore: 10,
        },
      ],
    },
  ]
  