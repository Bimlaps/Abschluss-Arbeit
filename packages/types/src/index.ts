// Gemeinsame Typdefinitionen für alle Dienste

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
  CANCELLED = 'cancelled',
}

export enum WebsiteStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface User {
  id: string;
  email: string;
  password?: string; // Nicht in Antworten enthalten
  name: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Website {
  id: string;
  userId: string;
  subdomain: string;
  customDomain?: string;
  templateId: string;
  colorSchemeId: string;
  content: Record<string, any>; // JSON-Struktur für Inhalte
  status: WebsiteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  htmlStructure: string;
  cssStructure: string;
  availableSections: string[];
  createdAt: Date;
}

export interface Gallery {
  id: string;
  websiteId: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  galleryId: string;
  imageUrl: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
