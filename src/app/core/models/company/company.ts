export class Company {
  id!: number;
  name!: string;
  email!: string;
  phone!: string;
  logo!: any;
  type!: string;
  size!: string;
  creationYear!: number;
  address!: string;
  website!: string;
  about!: string;
  vision!: string;
  socialNetworks!: SocialNetwork;
  contacts!: string[];
  jobsCount?: number;
}

export class SocialNetwork {
  facebookUrl!: string;
  twitterUrl!: string;
  instagramUrl!: string;
  youtubeUrl!: string;
  linkedinUrl!: string;
}

export class Contact {
  address!: string;
  email!: string;
  phone!: string;
}

