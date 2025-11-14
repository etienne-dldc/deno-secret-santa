export interface TAssignment {
  from: string;
  to: string;
}

export type TConstraintKind =
  | "no_gift_exchange"
  | "cannot_give_to"
  | "cannot_receive_from";

export interface TConstraint {
  left: string;
  right: string;
  kind: TConstraintKind;
}

export interface TProject {
  id: string;
  name: string;
  passwordHash?: string;
  assignments: null | TAssignment[];
  constraints?: TConstraint[];
  createdAt?: number;
}

export interface TUser {
  id: string;
  name: string;
  hint: string;
  passwordHash: string;
}
