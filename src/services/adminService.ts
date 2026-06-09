import { NotFoundError, ConflictError, AppError } from "../errors/AppError";
import { Admin, AdminInput } from "../models/admin";

export interface AdminRepository {
  findAll(): Promise<Admin[]>;
  findById(id: number): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  create(dados: AdminInput): Promise<Admin>;
  update(id: number, dados: Partial<AdminInput>): Promise<Admin | null>;
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

    async create(dados: AdminInput): Promise<Admin> {
      const existe = await repository.findByEmail(dados.email);

      if (existe) {
        throw new ConflictError("Email já cadastrado");
      }

      return await repository.create(dados);
    },

    async update(id: string, dados: Partial<AdminInput>): Promise<Admin> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const admin = await repository.findById(numericId);

      if (!admin) {
        throw new NotFoundError("Administrador não encontrado");
      }

      const atualizado = await repository.update(numericId, dados);

      if (!atualizado) {
        throw new AppError("Falha ao atualizar administrador.", 500);
      }

      return atualizado;
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
