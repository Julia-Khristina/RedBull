import { NotFoundError, ConflictError, AppError } from "../errors/AppError";
import { Administrador, AdministradorInput } from "../models/administrador";

export interface AdministradorRepository {
  findAll(): Promise<Administrador[]>;
  findById(id: number): Promise<Administrador | null>;
  findByEmail(email: string): Promise<Administrador | null>;
  create(dados: AdministradorInput): Promise<Administrador>;
  update(id: number, dados: Partial<AdministradorInput>): Promise<Administrador | null>;
  delete(id: number): Promise<boolean>;
}

export function createAdministradorService(repository: AdministradorRepository) {
  return {
    async listar(): Promise<Administrador[]> {
      return await repository.findAll();
    },

    async buscarPorId(id: string): Promise<Administrador> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const administrador = await repository.findById(numericId);

      if (!administrador) {
        throw new NotFoundError("Administrador não encontrado");
      }

      return administrador;
    },

    async buscarPorEmail(email: string): Promise<Administrador | null> {
      return await repository.findByEmail(email);
    },

    async criar(dados: AdministradorInput): Promise<Administrador> {
      const existe = await repository.findByEmail(dados.email);

      if (existe) {
        throw new ConflictError("Email já cadastrado");
      }

      return await repository.create(dados);
    },

    async atualizar(id: string, dados: Partial<AdministradorInput>): Promise<Administrador> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const administrador = await repository.findById(numericId);

      if (!administrador) {
        throw new NotFoundError("Administrador não encontrado");
      }

      const atualizado = await repository.update(numericId, dados);

      if (!atualizado) {
        throw new AppError("Falha ao atualizar administrador.", 500);
      }

      return atualizado;
    },

    async excluir(id: string): Promise<void> {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new AppError("ID de administrador inválido.", 400);
      }

      const administrador = await repository.findById(numericId);

      if (!administrador) {
        throw new NotFoundError("Administrador não encontrado");
      }

      const deleted = await repository.delete(numericId);

      if (!deleted) {
        throw new AppError("Falha ao excluir administrador.", 500);
      }
    },
  };
}

export type AdministradorService = ReturnType<typeof createAdministradorService>;
