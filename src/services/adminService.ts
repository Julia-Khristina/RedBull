import { NotFoundError, ConflictError, AppError } from "../errors/AppError";
import { Admin, AdminInput } from "../models/admin";

export interface AdminRepository {
  findAll(): Promise<Admin[]>;
  findById(id: number): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  create(input: AdminInput): Promise<Admin>;
  update(id: number, input: Partial<AdminInput>): Promise<Admin | null>;
  delete(id: number): Promise<boolean>;
}

export function createAdminService(repository: AdminRepository) {
  return {
    async findAll(): Promise<Admin[]> {
      return await repository.findAll();
    },

    async findById(id: string): Promise<Admin> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const admin = await repository.findById(numericId);

      if (!admin) {
        throw new NotFoundError("Administrador não encontrado");
      }

      return admin;
    },

    async findByEmail(email: string): Promise<Admin | null> {
      return await repository.findByEmail(email);
    },

    async create(input: AdminInput): Promise<Admin> {
      const existing = await repository.findByEmail(input.email);

      if (existing) {
        throw new ConflictError("Email já cadastrado");
      }

      return await repository.create(input);
    },

    async update(id: string, input: Partial<AdminInput>): Promise<Admin> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const admin = await repository.findById(numericId);

      if (!admin) {
        throw new NotFoundError("Administrador não encontrado");
      }

      const updated = await repository.update(numericId, input);

      if (!updated) {
        throw new AppError("Falha ao atualizar administrador.", 500);
      }

      return updated;
    },

    async delete(id: string): Promise<void> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const admin = await repository.findById(numericId);

      if (!admin) {
        throw new NotFoundError("Administrador não encontrado");
      }

      const deleted = await repository.delete(numericId);

      if (!deleted) {
        throw new AppError("Falha ao excluir administrador.", 500);
      }
    },
  };
}

export type AdminServiceType = ReturnType<typeof createAdminService>;
