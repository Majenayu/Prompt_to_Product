import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertRenewableProjectSchema,
  insertCarbonEmissionSchema,
  insertFinancingSchemeSchema,
  insertRegionalCapacitySchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/projects", async (req, res) => {
    try {
      let projects = await storage.getProjects();
      
      const { state, technology, status } = req.query;
      
      if (state && typeof state === 'string') {
        projects = projects.filter(p => p.state === state);
      }
      if (technology && typeof technology === 'string') {
        projects = projects.filter(p => p.technology === technology);
      }
      if (status && typeof status === 'string') {
        projects = projects.filter(p => p.status === status);
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertRenewableProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/carbon-emissions", async (_req, res) => {
    try {
      const emissions = await storage.getCarbonEmissions();
      res.json(emissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carbon emissions" });
    }
  });

  app.get("/api/carbon-emissions/:id", async (req, res) => {
    try {
      const emission = await storage.getCarbonEmissionById(req.params.id);
      if (!emission) {
        return res.status(404).json({ error: "Emission record not found" });
      }
      res.json(emission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emission record" });
    }
  });

  app.post("/api/carbon-emissions", async (req, res) => {
    try {
      const validatedData = insertCarbonEmissionSchema.parse(req.body);
      const emission = await storage.createCarbonEmission(validatedData);
      res.status(201).json(emission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create emission record" });
    }
  });

  app.delete("/api/carbon-emissions/:id", async (req, res) => {
    try {
      const success = await storage.deleteCarbonEmission(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Emission record not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete emission record" });
    }
  });

  app.get("/api/financing-schemes", async (req, res) => {
    try {
      let schemes = await storage.getFinancingSchemes();
      
      const { category } = req.query;
      
      if (category && typeof category === 'string') {
        schemes = schemes.filter(s => s.category === category);
      }
      
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch financing schemes" });
    }
  });

  app.get("/api/financing-schemes/:id", async (req, res) => {
    try {
      const scheme = await storage.getFinancingSchemeById(req.params.id);
      if (!scheme) {
        return res.status(404).json({ error: "Financing scheme not found" });
      }
      res.json(scheme);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch financing scheme" });
    }
  });

  app.post("/api/financing-schemes", async (req, res) => {
    try {
      const validatedData = insertFinancingSchemeSchema.parse(req.body);
      const scheme = await storage.createFinancingScheme(validatedData);
      res.status(201).json(scheme);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create financing scheme" });
    }
  });

  app.delete("/api/financing-schemes/:id", async (req, res) => {
    try {
      const success = await storage.deleteFinancingScheme(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Financing scheme not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete financing scheme" });
    }
  });

  app.get("/api/regional-capacity", async (_req, res) => {
    try {
      const capacities = await storage.getRegionalCapacity();
      res.json(capacities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regional capacity data" });
    }
  });

  app.get("/api/regional-capacity/:state", async (req, res) => {
    try {
      const capacity = await storage.getRegionalCapacityByState(req.params.state);
      if (!capacity) {
        return res.status(404).json({ error: "Regional capacity data not found" });
      }
      res.json(capacity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regional capacity" });
    }
  });

  app.post("/api/regional-capacity", async (req, res) => {
    try {
      const validatedData = insertRegionalCapacitySchema.parse(req.body);
      const capacity = await storage.createRegionalCapacity(validatedData);
      res.status(201).json(capacity);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create regional capacity" });
    }
  });

  app.delete("/api/regional-capacity/:id", async (req, res) => {
    try {
      const success = await storage.deleteRegionalCapacity(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Regional capacity not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete regional capacity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
