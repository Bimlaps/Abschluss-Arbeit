import { Request, Response } from 'express';
import Template from '../models/Template';

// Get all templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find().sort({ name: 1 });
    
    res.status(200).json({ templates });
  } catch (error) {
    console.error('Get all templates error:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Templates' });
  }
};

// Get a specific template by ID
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    res.status(200).json({ template });
  } catch (error) {
    console.error('Get template by ID error:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Templates' });
  }
};

// Create a new template (admin only)
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, thumbnail, htmlStructure, cssStructure, availableSections } = req.body;
    
    // Create new template
    const template = new Template({
      name,
      description,
      thumbnail,
      htmlStructure,
      cssStructure,
      availableSections,
    });
    
    await template.save();
    
    res.status(201).json({
      message: 'Template erfolgreich erstellt',
      template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen des Templates' });
  }
};

// Update a template (admin only)
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, thumbnail, htmlStructure, cssStructure, availableSections } = req.body;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    // Update fields
    if (name) template.name = name;
    if (description) template.description = description;
    if (thumbnail) template.thumbnail = thumbnail;
    if (htmlStructure) template.htmlStructure = htmlStructure;
    if (cssStructure) template.cssStructure = cssStructure;
    if (availableSections) template.availableSections = availableSections;
    
    await template.save();
    
    res.status(200).json({
      message: 'Template erfolgreich aktualisiert',
      template,
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Templates' });
  }
};

// Delete a template (admin only)
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template nicht gefunden' });
    }
    
    await template.deleteOne();
    
    res.status(200).json({ message: 'Template erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen des Templates' });
  }
};
