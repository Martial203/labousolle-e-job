export class Job {
  id!: number;
  title!: string;
  address!: string;
  coverImage!: Blob;
  companyId!: number;
  companyName!: string;
  companyLogo!: any;
  categoryId!: number;
  categoryName!: string;
  expirationDate!: Date;
  creationDate!: Date;
  isFeatured!: boolean;
  jobType!: string;
  about!: string;
  description!: string;
  profileRequired!: string;
  experience!: string;
}
