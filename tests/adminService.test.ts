import { createAdminService, AdminRepository } from "../src/services/adminService";
import { Admin, AdminInput } from "../src/models/admin";
import { NotFoundError, ConflictError, AppError } from "../src/errors/AppError";

describe("AdminService", () => {
  let mockAdminRepository: any;
  let adminService: ReturnType<typeof createAdminService>;

  beforeEach(() => {
    mockAdminRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    adminService = createAdminService(mockAdminRepository);
  });

  describe("findAll", () => {
    it("should return a list of administrators", async () => {
      const expectedAdmins: Admin[] = [
        { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" },
        { id: 2, name: "Admin 2", email: "admin2@example.com", area: "RH", password: "senha123", created_at: "" },
      ];
      mockAdminRepository.findAll.mockResolvedValue(expectedAdmins);

      const result = await adminService.findAll();

      expect(mockAdminRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedAdmins);
    });
  });

  describe("findById", () => {
    it("should return an administrator if found", async () => {
      const expectedAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };
      mockAdminRepository.findById.mockResolvedValue(expectedAdmin);

      const result = await adminService.findById("1");

      expect(mockAdminRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedAdmin);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      mockAdminRepository.findById.mockResolvedValue(null);

      await expect(adminService.findById("99")).rejects.toThrow(NotFoundError);
      expect(mockAdminRepository.findById).toHaveBeenCalledWith(99);
    });

    it("should throw AppError if id is invalid", async () => {
      await expect(adminService.findById("abc")).rejects.toThrow(AppError);
      expect(mockAdminRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("should return an administrator if found by email", async () => {
      const expectedAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };
      mockAdminRepository.findByEmail.mockResolvedValue(expectedAdmin);

      const result = await adminService.findByEmail("admin1@example.com");

      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith("admin1@example.com");
      expect(result).toEqual(expectedAdmin);
    });

    it("should return null if administrator is not found by email", async () => {
      mockAdminRepository.findByEmail.mockResolvedValue(null);

      const result = await adminService.findByEmail("nonexistent@example.com");

      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new administrator if email is not taken", async () => {
      const createInput: AdminInput = { name: "New Admin", email: "newadmin@example.com", area: "TI", password: "senha123" };
      const expectedAdmin: Admin = { id: 3, ...createInput, created_at: "" };

      mockAdminRepository.findByEmail.mockResolvedValue(null);
      mockAdminRepository.create.mockResolvedValue(expectedAdmin);

      const result = await adminService.create(createInput);

      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith(createInput.email);
      expect(mockAdminRepository.create).toHaveBeenCalledWith(createInput);
      expect(result).toEqual(expectedAdmin);
    });

    it("should throw ConflictError if email is already taken", async () => {
      const createInput: AdminInput = { name: "New Admin", email: "existing@example.com", area: "TI", password: "senha123" };
      mockAdminRepository.findByEmail.mockResolvedValue({ id: 1, email: "existing@example.com" });

      await expect(adminService.create(createInput)).rejects.toThrow(ConflictError);
      expect(mockAdminRepository.findByEmail).toHaveBeenCalledWith(createInput.email);
      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });

    it("should throw AppError when required fields are missing", async () => {
      await expect(adminService.create({})).rejects.toThrow(AppError);
      expect(mockAdminRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockAdminRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update an administrator if found", async () => {
      const updateInput: Partial<AdminInput> = { name: "Updated Admin" };
      const existingAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };
      const updatedAdmin: Admin = { ...existingAdmin, ...updateInput };

      mockAdminRepository.findById.mockResolvedValue(existingAdmin);
      mockAdminRepository.update.mockResolvedValue(updatedAdmin);

      const result = await adminService.update("1", updateInput);

      expect(mockAdminRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdminRepository.update).toHaveBeenCalledWith(1, updateInput);
      expect(result).toEqual(updatedAdmin);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      const updateInput: Partial<AdminInput> = { name: "Updated Admin", area: "RH", password: "senha123" };
      mockAdminRepository.findById.mockResolvedValue(null);

      await expect(adminService.update("99", updateInput)).rejects.toThrow(NotFoundError);
      expect(mockAdminRepository.findById).toHaveBeenCalledWith(99);
      expect(mockAdminRepository.update).not.toHaveBeenCalled();
    });

    it("should throw AppError if id is invalid", async () => {
      const updateInput: Partial<AdminInput> = { name: "Updated Admin", area: "RH", password: "senha123" };
      await expect(adminService.update("abc", updateInput)).rejects.toThrow(AppError);
      expect(mockAdminRepository.findById).not.toHaveBeenCalled();
      expect(mockAdminRepository.update).not.toHaveBeenCalled();
    });

    it("should throw AppError if update fails in repository", async () => {
      const updateInput: Partial<AdminInput> = { name: "Updated Admin", area: "RH", password: "senha123" };
      const existingAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };

      mockAdminRepository.findById.mockResolvedValue(existingAdmin);
      mockAdminRepository.update.mockResolvedValue(null);

      await expect(adminService.update("1", updateInput)).rejects.toThrow(AppError);
      expect(mockAdminRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdminRepository.update).toHaveBeenCalledWith(1, updateInput);
    });
  });

  describe("delete", () => {
    it("should delete an administrator if found", async () => {
      const existingAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };

      mockAdminRepository.findById.mockResolvedValue(existingAdmin);
      mockAdminRepository.delete.mockResolvedValue(true);

      await expect(adminService.delete("1")).resolves.toBeUndefined();

      expect(mockAdminRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdminRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundError if administrator is not found", async () => {
      mockAdminRepository.findById.mockResolvedValue(null);

      await expect(adminService.delete("99")).rejects.toThrow(NotFoundError);
      expect(mockAdminRepository.findById).toHaveBeenCalledWith(99);
      expect(mockAdminRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw AppError if id is invalid", async () => {
      await expect(adminService.delete("abc")).rejects.toThrow(AppError);
      expect(mockAdminRepository.findById).not.toHaveBeenCalled();
      expect(mockAdminRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw AppError if delete fails in repository", async () => {
      const existingAdmin: Admin = { id: 1, name: "Admin 1", email: "admin1@example.com", area: "TI", password: "senha123", created_at: "" };

      mockAdminRepository.findById.mockResolvedValue(existingAdmin);
      mockAdminRepository.delete.mockResolvedValue(false);

      await expect(adminService.delete("1")).rejects.toThrow(AppError);
      expect(mockAdminRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAdminRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
