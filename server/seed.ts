import { db } from "./db";
import {
  renewableProjects,
  carbonEmissions,
  financingSchemes,
  regionalCapacity,
  type InsertRenewableProject,
  type InsertFinancingScheme,
  type InsertRegionalCapacity,
} from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const sampleStates: InsertRegionalCapacity[] = [
    { state: "Maharashtra", solarCapacity: "18500", windCapacity: "10200", hydroCapacity: "6800", totalCapacity: "35500", targetCapacity: "45000", population: 112000000 },
    { state: "Gujarat", solarCapacity: "15200", windCapacity: "8900", hydroCapacity: "3200", totalCapacity: "27300", targetCapacity: "35000", population: 60000000 },
    { state: "Karnataka", solarCapacity: "12800", windCapacity: "7200", hydroCapacity: "5400", totalCapacity: "25400", targetCapacity: "32000", population: 61000000 },
    { state: "Tamil Nadu", solarCapacity: "11200", windCapacity: "9800", hydroCapacity: "4200", totalCapacity: "25200", targetCapacity: "30000", population: 72000000 },
    { state: "Rajasthan", solarCapacity: "16800", windCapacity: "6200", hydroCapacity: "1800", totalCapacity: "24800", targetCapacity: "28000", population: 68000000 },
    { state: "Andhra Pradesh", solarCapacity: "9800", windCapacity: "5600", hydroCapacity: "3200", totalCapacity: "18600", targetCapacity: "24000", population: 49000000 },
    { state: "Madhya Pradesh", solarCapacity: "8200", windCapacity: "3800", hydroCapacity: "4600", totalCapacity: "16600", targetCapacity: "20000", population: 73000000 },
    { state: "Uttar Pradesh", solarCapacity: "7200", windCapacity: "2800", hydroCapacity: "3200", totalCapacity: "13200", targetCapacity: "18000", population: 200000000 },
    { state: "Kerala", solarCapacity: "5200", windCapacity: "1800", hydroCapacity: "6200", totalCapacity: "13200", targetCapacity: "15000", population: 33000000 },
    { state: "West Bengal", solarCapacity: "4800", windCapacity: "1200", hydroCapacity: "4800", totalCapacity: "10800", targetCapacity: "14000", population: 91000000 },
  ];

  console.log("Seeding regional capacity...");
  await db.insert(regionalCapacity).values(sampleStates).onConflictDoNothing();

  const sampleProjects: InsertRenewableProject[] = [
    {
      name: "Bhadla Solar Park Phase IV",
      state: "Rajasthan",
      technology: "Solar",
      capacity: "2245",
      status: "Operational",
      description: "One of the world's largest solar parks, producing clean energy for millions",
      investmentAmount: "15000000000",
      completionDate: "2023-12-15",
    },
    {
      name: "Muppandal Wind Farm Expansion",
      state: "Tamil Nadu",
      technology: "Wind",
      capacity: "1500",
      status: "Under Construction",
      description: "Expanding India's pioneering wind energy facility",
      investmentAmount: "9800000000",
      completionDate: "2025-06-30",
    },
    {
      name: "Pavagada Solar Park",
      state: "Karnataka",
      technology: "Solar",
      capacity: "2050",
      status: "Operational",
      description: "Ultra mega solar park contributing to Karnataka's renewable targets",
      investmentAmount: "13500000000",
      completionDate: "2023-08-20",
    },
    {
      name: "Kutch Wind Power Project",
      state: "Gujarat",
      technology: "Wind",
      capacity: "1200",
      status: "Approved",
      description: "Harnessing Gujarat's coastal wind potential",
      investmentAmount: "8000000000",
      completionDate: "2025-12-31",
    },
    {
      name: "Tehri Hydro Phase III",
      state: "Uttarakhand",
      technology: "Hydro",
      capacity: "1000",
      status: "Planning",
      description: "Expanding the Tehri hydroelectric complex for clean baseload power",
      investmentAmount: "12000000000",
    },
  ];

  console.log("Seeding projects...");
  await db.insert(renewableProjects).values(sampleProjects).onConflictDoNothing();

  const sampleSchemes: InsertFinancingScheme[] = [
    {
      name: "PM-KUSUM Solar Subsidy",
      description: "Central government subsidy for solar pumps and grid-connected solar power plants for farmers",
      category: "Subsidies",
      fundingAmount: "Up to 60% of project cost (max ₹15 lakhs)",
      eligibility: "Farmers, farmer cooperatives, panchayats, and farmer producer organizations",
      applicationDeadline: "March 31, 2025",
      targetTechnology: "Solar",
      contactInfo: "mnre.gov.in",
    },
    {
      name: "Green Energy Corridor Loan",
      description: "Low-interest loans for renewable energy transmission infrastructure development",
      category: "Loans",
      fundingAmount: "₹5 crores to ₹500 crores at 7.5% interest",
      eligibility: "State transmission utilities, private transmission companies",
      applicationDeadline: "Ongoing",
      targetTechnology: "All",
      contactInfo: "powermin.gov.in",
    },
    {
      name: "MNRE Innovation Grant",
      description: "Research and development grants for breakthrough renewable energy technologies",
      category: "Grants",
      fundingAmount: "Up to ₹2 crores per project",
      eligibility: "Research institutions, startups, technology companies",
      applicationDeadline: "June 30, 2025",
      targetTechnology: "All",
      contactInfo: "mnre-innovation@gov.in",
    },
    {
      name: "Accelerated Depreciation for Wind",
      description: "Tax benefit allowing 40% depreciation in first year for wind energy projects",
      category: "Tax Incentives",
      fundingAmount: "40% depreciation benefit",
      eligibility: "Commercial wind energy project developers",
      targetTechnology: "Wind",
      contactInfo: "incometax.gov.in",
    },
  ];

  console.log("Seeding financing schemes...");
  await db.insert(financingSchemes).values(sampleSchemes).onConflictDoNothing();

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
