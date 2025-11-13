import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const renewableProjects = pgTable("renewable_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  state: text("state").notNull(),
  technology: text("technology").notNull(),
  capacity: decimal("capacity", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(),
  description: text("description"),
  investmentAmount: decimal("investment_amount", { precision: 15, scale: 2 }),
  completionDate: text("completion_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonEmissions = pgTable("carbon_emissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type").notNull(),
  state: text("state").notNull(),
  reportingPeriod: text("reporting_period").notNull(),
  energyEmissions: decimal("energy_emissions", { precision: 10, scale: 2 }).notNull(),
  transportEmissions: decimal("transport_emissions", { precision: 10, scale: 2 }).notNull(),
  wasteEmissions: decimal("waste_emissions", { precision: 10, scale: 2 }).notNull(),
  totalEmissions: decimal("total_emissions", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const financingSchemes = pgTable("financing_schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  fundingAmount: text("funding_amount").notNull(),
  eligibility: text("eligibility").notNull(),
  applicationDeadline: text("application_deadline"),
  targetTechnology: text("target_technology"),
  contactInfo: text("contact_info"),
});

export const regionalCapacity = pgTable("regional_capacity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  state: text("state").notNull().unique(),
  solarCapacity: decimal("solar_capacity", { precision: 10, scale: 2 }).notNull(),
  windCapacity: decimal("wind_capacity", { precision: 10, scale: 2 }).notNull(),
  hydroCapacity: decimal("hydro_capacity", { precision: 10, scale: 2 }).notNull(),
  totalCapacity: decimal("total_capacity", { precision: 10, scale: 2 }).notNull(),
  targetCapacity: decimal("target_capacity", { precision: 10, scale: 2 }).notNull(),
  population: integer("population"),
});

export const insertRenewableProjectSchema = createInsertSchema(renewableProjects).omit({
  id: true,
  createdAt: true,
});

export const insertCarbonEmissionSchema = createInsertSchema(carbonEmissions).omit({
  id: true,
  createdAt: true,
});

export const insertFinancingSchemeSchema = createInsertSchema(financingSchemes).omit({
  id: true,
});

export const insertRegionalCapacitySchema = createInsertSchema(regionalCapacity).omit({
  id: true,
});

export type InsertRenewableProject = z.infer<typeof insertRenewableProjectSchema>;
export type RenewableProject = typeof renewableProjects.$inferSelect;

export type InsertCarbonEmission = z.infer<typeof insertCarbonEmissionSchema>;
export type CarbonEmission = typeof carbonEmissions.$inferSelect;

export type InsertFinancingScheme = z.infer<typeof insertFinancingSchemeSchema>;
export type FinancingScheme = typeof financingSchemes.$inferSelect;

export type InsertRegionalCapacity = z.infer<typeof insertRegionalCapacitySchema>;
export type RegionalCapacity = typeof regionalCapacity.$inferSelect;

export const projectStatuses = ["Planning", "Approved", "Under Construction", "Operational"] as const;
export const technologies = ["Solar", "Wind", "Hydro", "Biomass", "Nuclear"] as const;
export const organizationTypes = ["Small Business", "Local Government", "Large Corporation", "NGO"] as const;
export const schemeCategories = ["Subsidies", "Loans", "Grants", "Tax Incentives"] as const;

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
] as const;
