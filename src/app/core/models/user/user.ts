import { Role } from "../../enums/role/role";

export class User {
  id!: number;
  firstName!: string;
  name!: string;
  email!: string;
  role!: Role;
  token!: string;
}
