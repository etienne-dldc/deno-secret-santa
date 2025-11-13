export interface TAssignment {
  from: string;
  to: string;
}

export interface TProject {
  id: string;
  name: string;
  passwordHash?: string;
  assignments: null | TAssignment[];
}

export interface TUser {
  id: string;
  name: string;
  hint: string;
  passwordHash: string;
}
