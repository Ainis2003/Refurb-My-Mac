// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum ComputerStatus {
  Bought = "bought",
  NotYetRepaired = "not yet repaired",
  WaitingForParts = "waiting for parts",
  RepairedWaitingForListing = "repaired waiting for listing",
  Listed = "listed",
  Sold = "sold",
  HasProblems = "has problems",
}

export enum Role {
  Admin = "Admin",
  Repairman = "Repairman",
}

export enum Table {
  AppUser = "app_user",
  ComputerRepairmen = "computer_repairmen",
  Computers = "computers",
  KnexMigrations = "knex_migrations",
  KnexMigrationsLock = "knex_migrations_lock",
  Makes = "makes",
  ModelAllowedRam = "model_allowed_ram",
  ModelAllowedSsd = "model_allowed_ssd",
  Models = "models",
  RamOptions = "ram_options",
  RefreshToken = "refresh_token",
  Repairs = "repairs",
  Shipments = "shipments",
  SsdOptions = "ssd_options",
}

export type Tables = {
  "app_user": AppUser,
  "computer_repairmen": ComputerRepairmen,
  "computers": Computers,
  "knex_migrations": KnexMigrations,
  "knex_migrations_lock": KnexMigrationsLock,
  "makes": Makes,
  "model_allowed_ram": ModelAllowedRam,
  "model_allowed_ssd": ModelAllowedSsd,
  "models": Models,
  "ram_options": RamOptions,
  "refresh_token": RefreshToken,
  "repairs": Repairs,
  "shipments": Shipments,
  "ssd_options": SsdOptions,
};

export type AppUser = {
  id: number;
  username: string;
  password: string;
  role: Role;
  deleted: boolean;
};

export type ComputerRepairmen = {
  computer_id: number;
  repairman_id: number;
  assigned_at: Date | null;
  unassigned_at: Date | null;
  is_primary: boolean | null;
};

export type Computers = {
  id: number;
  model_id: number;
  ram_option_id: number;
  ssd_option_id: number;
  purchase_price: string;
  purchase_date: Date;
  sold_price: string | null;
  sold_date: Date | null;
  status: ComputerStatus;
  primary_repairman_id: number | null;
  note: string | null;
  qr_code: string | null;
};

export type KnexMigrations = {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
};

export type KnexMigrationsLock = {
  index: number;
  is_locked: number | null;
};

export type Makes = {
  id: number;
  name: string;
};

export type ModelAllowedRam = {
  model_id: number;
  ram_option_id: number;
};

export type ModelAllowedSsd = {
  model_id: number;
  ssd_option_id: number;
};

export type Models = {
  id: number;
  make_id: number;
  name: string;
};

export type RamOptions = {
  id: number;
  label: string;
  gb: number;
};

export type RefreshToken = {
  id: number;
  user_id: number;
  token: string;
  created_at: Date | null;
  expires_at: Date;
};

export type Repairs = {
  id: number;
  computer_id: number;
  repairman_id: number | null;
  description: string | null;
  notes: string | null;
  cost: string;
  hours: string;
  shipment_id: number | null;
  created_at: Date | null;
  marked_complete: boolean;
  approved: boolean | null;
  admin_id: number | null;
  admin_comment: string | null;
  approved_at: Date | null;
};

export type Shipments = {
  id: number;
  tracking_number: string;
  supplier_name: string;
  date_sent: Date;
  date_received: Date | null;
  cost_send: string;
  cost_receive: string;
  note: string | null;
};

export type SsdOptions = {
  id: number;
  label: string;
  gb: number;
};

