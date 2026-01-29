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

export class JobSearchParams {
  [key: string]: any;
  category?: string;
  city?: string;
  experience_max?: number;
  experience_min?: number;
  job_type?: string;
  page_size?: number;
  page?: number;
  q?: string;
}