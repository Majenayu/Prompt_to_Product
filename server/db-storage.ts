import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  renewableProjects,
  carbonEmissions,
  financingSchemes,
  regionalCapacity,
  type RenewableProject,
  type InsertRenewableProject,
  type CarbonEmission,
  type InsertCarbonEmission,
  type FinancingScheme,
  type InsertFinancingScheme,
  type RegionalCapacity,
  type InsertRegionalCapacity,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async getProjects(): Promise<RenewableProject[]> {
    return await db.select().from(renewableProjects);
  }

  async getProjectById(id: string): Promise<RenewableProject | undefined> {
    const results = await db.select().from(renewableProjects).where(eq(renewableProjects.id, id));
    return results[0];
  }

  async createProject(project: InsertRenewableProject): Promise<RenewableProject> {
    const results = await db.insert(renewableProjects).values(project).returning();
    return results[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const results = await db.delete(renewableProjects).where(eq(renewableProjects.id, id)).returning();
    return results.length > 0;
  }

  async getCarbonEmissions(): Promise<CarbonEmission[]> {
    return await db.select().from(carbonEmissions);
  }

  async getCarbonEmissionById(id: string): Promise<CarbonEmission | undefined> {
    const results = await db.select().from(carbonEmissions).where(eq(carbonEmissions.id, id));
    return results[0];
  }

  async createCarbonEmission(emission: InsertCarbonEmission): Promise<CarbonEmission> {
    const results = await db.insert(carbonEmissions).values(emission).returning();
    return results[0];
  }

  async deleteCarbonEmission(id: string): Promise<boolean> {
    const results = await db.delete(carbonEmissions).where(eq(carbonEmissions.id, id)).returning();
    return results.length > 0;
  }

  async getFinancingSchemes(): Promise<FinancingScheme[]> {
    return await db.select().from(financingSchemes);
  }

  async getFinancingSchemeById(id: string): Promise<FinancingScheme | undefined> {
    const results = await db.select().from(financingSchemes).where(eq(financingSchemes.id, id));
    return results[0];
  }

  async createFinancingScheme(scheme: InsertFinancingScheme): Promise<FinancingScheme> {
    const results = await db.insert(financingSchemes).values(scheme).returning();
    return results[0];
  }

  async deleteFinancingScheme(id: string): Promise<boolean> {
    const results = await db.delete(financingSchemes).where(eq(financingSchemes.id, id)).returning();
    return results.length > 0;
  }

  async getRegionalCapacity(): Promise<RegionalCapacity[]> {
    return await db.select().from(regionalCapacity);
  }

  async getRegionalCapacityByState(state: string): Promise<RegionalCapacity | undefined> {
    const results = await db.select().from(regionalCapacity).where(eq(regionalCapacity.state, state));
    return results[0];
  }

  async createRegionalCapacity(capacity: InsertRegionalCapacity): Promise<RegionalCapacity> {
    const results = await db.insert(regionalCapacity).values(capacity).returning();
    return results[0];
  }

  async deleteRegionalCapacity(id: string): Promise<boolean> {
    const results = await db.delete(regionalCapacity).where(eq(regionalCapacity.id, id)).returning();
    return results.length > 0;
  }
}
