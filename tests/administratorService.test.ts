import { createAdministradorService, AdministradorRepository } from "../src/services/administradorService";
import { Administrador, AdministradorInput } from "../src/models/administrador";
import { NotFoundError, ConflictError, AppError } from "../src/errors/AppError";

describe("AdministradorService", () => {
  let mockAdministradorRepository: any;
  let administradorService: ReturnType<typeof createAdministradorService>;

  beforeEach(() => {
    mockAdministradorRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    administradorService = createAdministradorService(mockAdministradorRepository);
  });

  describe("listar", () => {
    it("should return a list of administrators", async () => {
      const expectedAdministrators: Administrador[] = [
        { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" },
        { id: 2, nome: "Admin 2", email: "admin2@example.com", area: "RH", senha: "senha123", criado_em: "" },
      ];
      mockAdministradorRepository.findAll.mockResolvedValue(expectedAdministrators);

      const result = await administradorService.listar();

      expect(mockAdministradorRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedAdministrators);
    });
  });

  describe("buscarPorId", () => {
    it("should return an administrator if found", async () => {
      const expectedAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };
      mockAdministradorRepository.findById.mockResolvedValue(expectedAdministrator);

      const result = await administradorService.buscarPorId("1");

      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedAdministrator);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      mockAdministradorRepository.findById.mockResolvedValue(null);

      await expect(administradorService.buscarPorId("99")).rejects.toThrow(NotFoundError);
      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(99);
    });

    it("should throw AppError if id is invalid", async () => {
      await expect(administradorService.buscarPorId("abc")).rejects.toThrow(AppError);
      expect(mockAdministradorRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("buscarPorEmail", () => {
    it("should return an administrator if found by email", async () => {
      const expectedAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };
      mockAdministradorRepository.findByEmail.mockResolvedValue(expectedAdministrator);

      const result = await administradorService.buscarPorEmail("admin1@example.com");

      expect(mockAdministradorRepository.findByEmail).toHaveBeenCalledWith("admin1@example.com");
      expect(result).toEqual(expectedAdministrator);
    });

    it("should return null if administrator is not found by email", async () => {
      mockAdministradorRepository.findByEmail.mockResolvedValue(null);

      const result = await administradorService.buscarPorEmail("nonexistent@example.com");

      expect(mockAdministradorRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(result).toBeNull();
    });
  });

  describe("criar", () => {
    it("should create a new administrator if email is not taken", async () => {
      const createInput: AdministradorInput = { nome: "New Admin", email: "newadmin@example.com", area: "TI", senha: "senha123" };
      const expectedAdministrator: Administrador = { id: 3, ...createInput, criado_em: "" };

      mockAdministradorRepository.findByEmail.mockResolvedValue(null);
      mockAdministradorRepository.create.mockResolvedValue(expectedAdministrator);

      const result = await administradorService.criar(createInput);

      expect(mockAdministradorRepository.findByEmail).toHaveBeenCalledWith(createInput.email);
      expect(mockAdministradorRepository.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual(expectedAdministrator);
    });

    it("should throw ConflictError if email is already taken", async () => {
      const createInput: AdministradorInput = { nome: "New Admin", email: "existing@example.com", area: "TI", senha: "senha123" };
      mockAdministradorRepository.findByEmail.mockResolvedValue({ id: 1, email: "existing@example.com" });

      await expect(administradorService.criar(createInput)).rejects.toThrow(ConflictError);
      expect(mockAdministradorRepository.findByEmail).toHaveBeenCalledWith(createInput.email);
      expect(mockAdministradorRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("atualizar", () => {
    it("should update an administrator if found", async () => {
      const updateInput: Partial<AdministradorInput> = { nome: "Updated Admin" };
      const existingAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };
      const updatedAdministrator: Administrador = { ...existingAdministrator, ...updateInput };

      mockAdministradorRepository.findById.mockResolvedValue(existingAdministrator);
      mockAdministradorRepository.update.mockResolvedValue(updatedAdministrator);

      const result = await administradorService.atualizar("1", updateInput);

      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdministradorRepository.update).toHaveBeenCalledWith(1, updateInput);
      expect(result).toEqual(updatedAdministrator);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      const updateInput: Partial<AdministradorInput> = { nome: "Updated Admin", area: "RH", senha: "senha123" };
      mockAdministradorRepository.findById.mockResolvedValue(null);

      await expect(administradorService.atualizar("99", updateInput)).rejects.toThrow(NotFoundError);
      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(99);
      expect(mockAdministradorRepository.update).not.toHaveBeenCalled();
    });

    it("should throw AppError if id is invalid", async () => {
      const updateInput: Partial<AdministradorInput> = { nome: "Updated Admin", area: "RH", senha: "senha123" };
      await expect(administradorService.atualizar("abc", updateInput)).rejects.toThrow(AppError);
      expect(mockAdministradorRepository.findById).not.toHaveBeenCalled();
      expect(mockAdministradorRepository.update).not.toHaveBeenCalled();
    });

    it("should throw AppError if update fails in repository", async () => {
      const updateInput: Partial<AdministradorInput> = { nome: "Updated Admin", area: "RH", senha: "senha123" };
      const existingAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };

      mockAdministradorRepository.findById.mockResolvedValue(existingAdministrator);
      mockAdministradorRepository.update.mockResolvedValue(null);

      await expect(administradorService.atualizar("1", updateInput)).rejects.toThrow(AppError);
      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdministradorRepository.update).toHaveBeenCalledWith(1, updateInput);
    });
  });

  describe("excluir", () => {
    it("should delete an administrator if found", async () => {
      const existingAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };

      mockAdministradorRepository.findById.mockResolvedValue(existingAdministrator);
      mockAdministradorRepository.delete.mockResolvedValue(true);

      await expect(administradorService.excluir("1")).resolves.toBeUndefined();

      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdministradorRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      mockAdministradorRepository.findById.mockResolvedValue(null);

      await expect(administradorService.excluir("99")).rejects.toThrow(NotFoundError);
      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(99);
      expect(mockAdministradorRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw AppError if id is invalid", async () => {
      await expect(administradorService.excluir("abc")).rejects.toThrow(AppError);
      expect(mockAdministradorRepository.findById).not.toHaveBeenCalled();
      expect(mockAdministradorRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw AppError if delete fails in repository", async () => {
      const existingAdministrator: Administrador = { id: 1, nome: "Admin 1", email: "admin1@example.com", area: "TI", senha: "senha123", criado_em: "" };

      mockAdministradorRepository.findById.mockResolvedValue(existingAdministrator);
      mockAdministradorRepository.delete.mockResolvedValue(false);

      await expect(administradorService.excluir("1")).rejects.toThrow(AppError);
      expect(mockAdministradorRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdministradorRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});