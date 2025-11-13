import {
  type RenewableProject,
  type InsertRenewableProject,
  type CarbonEmission,
  type InsertCarbonEmission,
  type FinancingScheme,
  type InsertFinancingScheme,
  type RegionalCapacity,
  type InsertRegionalCapacity,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProjects(): Promise<RenewableProject[]>;
  getProjectById(id: string): Promise<RenewableProject | undefined>;
  createProject(project: InsertRenewableProject): Promise<RenewableProject>;
  deleteProject(id: string): Promise<boolean>;
  
  getCarbonEmissions(): Promise<CarbonEmission[]>;
  getCarbonEmissionById(id: string): Promise<CarbonEmission | undefined>;
  createCarbonEmission(emission: InsertCarbonEmission): Promise<CarbonEmission>;
  deleteCarbonEmission(id: string): Promise<boolean>;
  
  getFinancingSchemes(): Promise<FinancingScheme[]>;
  getFinancingSchemeById(id: string): Promise<FinancingScheme | undefined>;
  createFinancingScheme(scheme: InsertFinancingScheme): Promise<FinancingScheme>;
  deleteFinancingScheme(id: string): Promise<boolean>;
  
  getRegionalCapacity(): Promise<RegionalCapacity[]>;
  getRegionalCapacityByState(state: string): Promise<RegionalCapacity | undefined>;
  createRegionalCapacity(capacity: InsertRegionalCapacity): Promise<RegionalCapacity>;
  deleteRegionalCapacity(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, RenewableProject>;
  private carbonEmissions: Map<string, CarbonEmission>;
  private financingSchemes: Map<string, FinancingScheme>;
  private regionalCapacity: Map<string, RegionalCapacity>;

  constructor() {
    this.projects = new Map();
    this.carbonEmissions = new Map();
    this.financingSchemes = new Map();
    this.regionalCapacity = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleStates = [
      { state: "Maharashtra", solar: 18500, wind: 10200, hydro: 6800, target: 45000, population: 112000000 },
      { state: "Gujarat", solar: 15200, wind: 8900, hydro: 3200, target: 35000, population: 60000000 },
      { state: "Karnataka", solar: 12800, wind: 7200, hydro: 5400, target: 32000, population: 61000000 },
      { state: "Tamil Nadu", solar: 11200, wind: 9800, hydro: 4200, target: 30000, population: 72000000 },
      { state: "Rajasthan", solar: 16800, wind: 6200, hydro: 1800, target: 28000, population: 68000000 },
      { state: "Andhra Pradesh", solar: 9800, wind: 5600, hydro: 3200, target: 24000, population: 49000000 },
      { state: "Madhya Pradesh", solar: 8200, wind: 3800, hydro: 4600, target: 20000, population: 73000000 },
      { state: "Uttar Pradesh", solar: 7200, wind: 2800, hydro: 3200, target: 18000, population: 200000000 },
      { state: "Kerala", solar: 5200, wind: 1800, hydro: 6200, target: 15000, population: 33000000 },
      { state: "West Bengal", solar: 4800, wind: 1200, hydro: 4800, target: 14000, population: 91000000 },
    ];

    sampleStates.forEach((s) => {
      const id = randomUUID();
      const capacity: RegionalCapacity = {
        id,
        state: s.state,
        solarCapacity: s.solar.toString(),
        windCapacity: s.wind.toString(),
        hydroCapacity: s.hydro.toString(),
        totalCapacity: (s.solar + s.wind + s.hydro).toString(),
        targetCapacity: s.target.toString(),
        population: s.population,
      };
      this.regionalCapacity.set(id, capacity);
    });

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

    sampleProjects.forEach((p) => {
      const id = randomUUID();
      const project: RenewableProject = {
        id,
        name: p.name,
        state: p.state,
        technology: p.technology,
        capacity: p.capacity,
        status: p.status,
        description: p.description ?? null,
        investmentAmount: p.investmentAmount ?? null,
        completionDate: p.completionDate ?? null,
        createdAt: new Date(),
      };
      this.projects.set(id, project);
    });

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

    sampleSchemes.forEach((s) => {
      const id = randomUUID();
      const scheme: FinancingScheme = {
        id,
        name: s.name,
        description: s.description,
        category: s.category,
        fundingAmount: s.fundingAmount,
        eligibility: s.eligibility,
        applicationDeadline: s.applicationDeadline ?? null,
        targetTechnology: s.targetTechnology ?? null,
        contactInfo: s.contactInfo ?? null,
      };
      this.financingSchemes.set(id, scheme);
    });
  }

  async getProjects(): Promise<RenewableProject[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<RenewableProject | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertRenewableProject): Promise<RenewableProject> {
    const id = randomUUID();
    const project: RenewableProject = {
      id,
      name: insertProject.name,
      state: insertProject.state,
      technology: insertProject.technology,
      capacity: insertProject.capacity,
      status: insertProject.status,
      description: insertProject.description ?? null,
      investmentAmount: insertProject.investmentAmount ?? null,
      completionDate: insertProject.completionDate ?? null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getCarbonEmissions(): Promise<CarbonEmission[]> {
    return Array.from(this.carbonEmissions.values());
  }

  async getCarbonEmissionById(id: string): Promise<CarbonEmission | undefined> {
    return this.carbonEmissions.get(id);
  }

  async createCarbonEmission(insertEmission: InsertCarbonEmission): Promise<CarbonEmission> {
    const id = randomUUID();
    const emission: CarbonEmission = {
      id,
      organizationName: insertEmission.organizationName,
      organizationType: insertEmission.organizationType,
      state: insertEmission.state,
      reportingPeriod: insertEmission.reportingPeriod,
      energyEmissions: insertEmission.energyEmissions,
      transportEmissions: insertEmission.transportEmissions,
      wasteEmissions: insertEmission.wasteEmissions,
      totalEmissions: insertEmission.totalEmissions,
      createdAt: new Date(),
    };
    this.carbonEmissions.set(id, emission);
    return emission;
  }

  async deleteCarbonEmission(id: string): Promise<boolean> {
    return this.carbonEmissions.delete(id);
  }

  async getFinancingSchemes(): Promise<FinancingScheme[]> {
    return Array.from(this.financingSchemes.values());
  }

  async getFinancingSchemeById(id: string): Promise<FinancingScheme | undefined> {
    return this.financingSchemes.get(id);
  }

  async createFinancingScheme(insertScheme: InsertFinancingScheme): Promise<FinancingScheme> {
    const id = randomUUID();
    const scheme: FinancingScheme = {
      id,
      name: insertScheme.name,
      description: insertScheme.description,
      category: insertScheme.category,
      fundingAmount: insertScheme.fundingAmount,
      eligibility: insertScheme.eligibility,
      applicationDeadline: insertScheme.applicationDeadline ?? null,
      targetTechnology: insertScheme.targetTechnology ?? null,
      contactInfo: insertScheme.contactInfo ?? null,
    };
    this.financingSchemes.set(id, scheme);
    return scheme;
  }

  async deleteFinancingScheme(id: string): Promise<boolean> {
    return this.financingSchemes.delete(id);
  }

  async getRegionalCapacity(): Promise<RegionalCapacity[]> {
    return Array.from(this.regionalCapacity.values());
  }

  async getRegionalCapacityByState(state: string): Promise<RegionalCapacity | undefined> {
    return Array.from(this.regionalCapacity.values()).find((c) => c.state === state);
  }

  async createRegionalCapacity(insertCapacity: InsertRegionalCapacity): Promise<RegionalCapacity> {
    const id = randomUUID();
    const capacity: RegionalCapacity = {
      id,
      state: insertCapacity.state,
      solarCapacity: insertCapacity.solarCapacity,
      windCapacity: insertCapacity.windCapacity,
      hydroCapacity: insertCapacity.hydroCapacity,
      totalCapacity: insertCapacity.totalCapacity,
      targetCapacity: insertCapacity.targetCapacity,
      population: insertCapacity.population ?? null,
    };
    this.regionalCapacity.set(id, capacity);
    return capacity;
  }

  async deleteRegionalCapacity(id: string): Promise<boolean> {
    return this.regionalCapacity.delete(id);
  }
}

async function createStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    const { DbStorage } = await import("./db-storage");
    return new DbStorage();
  }
  return new MemStorage();
}

export const storage = await createStorage();
