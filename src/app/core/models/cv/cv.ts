/* ===========================
   INFORMATIONS PERSONNELLES
=========================== */
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title?: string; // ex: Développeur Full Stack
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  nationality?: string;
  dateOfBirth?: Date;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
  image?: string; //url of the user profile picture
}

/* ===========================
   PROFIL / RÉSUMÉ
=========================== */
export interface Profile {
  summary: string;
}

/* ===========================
   EXPÉRIENCES PROFESSIONNELLES
=========================== */
export interface Experience {
  jobTitle: string;
  company: string;
  location?: string; // Example: Yaoundé, 
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean; 
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
}

/* ===========================
   FORMATIONS
=========================== */
export interface Education {
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

/* ===========================
   COMPÉTENCES
=========================== */
export interface Skill {
  name: string;
  level?: SkillLevel;
}

export enum SkillLevel {
  BEGINNER = 'Débutant',
  INTERMEDIATE = 'Intermédiaire',
  ADVANCED = 'Avancé',
  EXPERT = 'Expert'
}

/* ===========================
   LANGUES
=========================== */
export interface Language {
  name: string;
  level: LanguageLevel;
}

export enum LanguageLevel {
  BASIC = 'Notions',
  INTERMEDIATE = 'Intermédiaire',
  FLUENT = 'Courant',
  NATIVE = 'Langue maternelle'
}

/* ===========================
   PROJETS
=========================== */
export interface Project {
  name: string;
  description?: string;
  role?: string;
  technologies?: string[];
  link?: string;
  startDate?: Date;
  endDate?: Date;
}

/* ===========================
   CERTIFICATIONS
=========================== */
export interface Certification {
  name: string;
  organization: string;
  issueDate?: Date;
  expirationDate?: Date;
  credentialUrl?: string;
}

/* ===========================
   CENTRES D’INTÉRÊT
=========================== */
export interface Interest {
  name: string;
}

/* ===========================
   RÉFÉRENCES
=========================== */
export interface Reference {
  name: string;
  position?: string;
  company?: string;
  email?: string;
  phone?: string;
}

/* ===========================
   PARAMÈTRES DE MISE EN PAGE
=========================== */
export interface CvLayoutSettings {
  templateName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  showPhoto?: boolean;
  showReferences?: boolean;
  language?: string; // fr, en...
}

/* ===========================
   CLASSE PRINCIPALE CV
=========================== */
export class CV {
  personalInfo!: PersonalInfo;
  profile?: Profile;

  experiences: Experience[] = [];
  educations: Education[] = [];
  skills: Skill[] = [];
  languages: Language[] = [];
  projects: Project[] = [];
  certifications: Certification[] = [];
  interests: Interest[] = [];
  references: Reference[] = [];
}