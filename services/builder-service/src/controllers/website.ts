import { Request, Response } from 'express';
import Website from '../models/Website';
import { WebsiteStatus } from '@247vitrine/types';

// Create a new website
export const createWebsite = async (req: Request, res: Response) => {
  try {
    const { subdomain, templateId, colorSchemeId, content } = req.body;
    
    // @ts-ignore - req.user is set by auth middleware
    const userId = req.user.id;

    // Check if subdomain is already taken
    const existingWebsite = await Website.findOne({ subdomain });
    if (existingWebsite) {
      return res.status(400).json({ message: 'Diese Subdomain ist bereits vergeben' });
    }

    // Create new website
    const website = new Website({
      userId,
      subdomain,
      templateId,
      colorSchemeId,
      content,
      status: WebsiteStatus.DRAFT,
    });

    await website.save();

    res.status(201).json({
      message: 'Website erfolgreich erstellt',
      website,
    });
  } catch (error) {
    console.error('Create website error:', error);
    res.status(500).json({ message: 'Serverfehler beim Erstellen der Website' });
  }
};

// Get all websites for the current user
export const getUserWebsites = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by auth middleware
    const userId = req.user.id;
    
    const websites = await Website.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ websites });
  } catch (error) {
    console.error('Get user websites error:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Websites' });
  }
};

// Get a specific website by ID
export const getWebsiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore - req.user is set by auth middleware
    const userId = req.user.id;
    
    const website = await Website.findOne({ _id: id, userId });
    
    if (!website) {
      return res.status(404).json({ message: 'Website nicht gefunden' });
    }
    
    res.status(200).json({ website });
  } catch (error) {
    console.error('Get website by ID error:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Website' });
  }
};

// Update a website
export const updateWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { templateId, colorSchemeId, content, customDomain, status } = req.body;
    
    // @ts-ignore - req.user is set by auth middleware
    const userId = req.user.id;
    
    // Find website and check ownership
    const website = await Website.findOne({ _id: id, userId });
    
    if (!website) {
      return res.status(404).json({ message: 'Website nicht gefunden' });
    }
    
    // Update fields
    if (templateId) website.templateId = templateId;
    if (colorSchemeId) website.colorSchemeId = colorSchemeId;
    if (content) website.content = content;
    if (customDomain !== undefined) website.customDomain = customDomain;
    if (status) website.status = status;
    
    await website.save();
    
    res.status(200).json({
      message: 'Website erfolgreich aktualisiert',
      website,
    });
  } catch (error) {
    console.error('Update website error:', error);
    res.status(500).json({ message: 'Serverfehler beim Aktualisieren der Website' });
  }
};

// Delete a website
export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // @ts-ignore - req.user is set by auth middleware
    const userId = req.user.id;
    
    // Find website and check ownership
    const website = await Website.findOne({ _id: id, userId });
    
    if (!website) {
      return res.status(404).json({ message: 'Website nicht gefunden' });
    }
    
    await website.deleteOne();
    
    res.status(200).json({ message: 'Website erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ message: 'Serverfehler beim Löschen der Website' });
  }
};
