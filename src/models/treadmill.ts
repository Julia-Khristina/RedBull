export interface Treadmill {
  id: number;
  name: string;
  specification: string | null;
  created_at: string;
}

export interface CreateTreadmillInput {
  name: string;
  specification?: string | null;
}

export interface TreadmillRepository {
  create(input: CreateTreadmillInput): Promise<Treadmill>;
  findFirst(): Promise<Treadmill | null>;
}
