import { SocialNetworkType } from "../../enums/social-network-type/social-network-type";

export class Company {
  id!: number;
  name!: string;
  email!: string;
  phone!: string;
  logo!: string;
  type!: string;
  size!: string;
  creationDate!: Date;
  website!: string;
  about!: string;
  vision!: string;
  socialNetworks!: SocialNetwork[];
  contacts!: string[];
}

export class SocialNetwork {
  name!: SocialNetworkType;
  url!: string;
}

export class Contact {
  address!: string;
  email!: string;
  phone!: string;
}