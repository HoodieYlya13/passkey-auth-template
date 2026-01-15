export type Passkey = {
  id: string;
  name: string;
  createdAt: Date;
  pending?: boolean;
};

export type OptimisticPasskeyActions =
  | { type: "ADD"; payload: Passkey }
  | { type: "DELETE"; payload: string }
  | { type: "RENAME"; payload: { id: string; newName: string } };
