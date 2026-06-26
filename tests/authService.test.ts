import { createAuthService } from "../src/services/authService";
import { AuthResponse, LoginInput } from "../src/models/auth";
import { AppError, UnauthorizedError } from "../src/errors/AppError";
import bcrypt from "bcryptjs";

describe("authService", () => {
  let mockAdminRepository: any;
  let authService: ReturnType<typeof createAuthService>;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("adminpass", 10);
  });

  beforeEach(() => {
    mockAdminRepository = {
      findByEmail: jest.fn(),
    };
    authService = createAuthService(mockAdminRepository);
  });

  describe("createSession", () => {
    it("should return auth response for valid admin credentials", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };
      const expectedAdmin = { id: 1, email: "admin@example.com", name: "Admin", role: "admin" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      const result = await authService.createSession(loginInput);

      expect(result.admin).toEqual(expectedAdmin);
      expect(typeof result.access_token).toBe("string");
      expect(typeof result.refresh_token).toBe("string");
      expect(result.refresh_token).toEqual(result.access_token);
    });

    it("should throw UnauthorizedError for invalid email", async () => {
      const loginInput: LoginInput = { email: "invalid@example.com", password: "adminpass" };

      mockAdminRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.createSession(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError for wrong password", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "wrongpass" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      await expect(authService.createSession(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw AppError when ADMIN_PASSWORD_HASH is missing", async () => {
      const originalPasswordHash = process.env.ADMIN_PASSWORD_HASH;
      delete process.env.ADMIN_PASSWORD_HASH;

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      try {
        await expect(
          authService.createSession({
            email: "admin@example.com",
            password: "adminpass",
          })
        ).rejects.toBeInstanceOf(AppError);
      } finally {
        process.env.ADMIN_PASSWORD_HASH = originalPasswordHash;
      }
    });
  });

  describe("refresh", () => {
    it("should issue a new token for a valid refresh token", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      const authResponse = await authService.createSession(loginInput);
      const result = await authService.refreshToken(authResponse.refresh_token);

      expect(result.admin).toEqual(authResponse.admin);
      expect(typeof result.access_token).toBe("string");
      expect(typeof result.refresh_token).toBe("string");
    });

    it("should throw UnauthorizedError for invalid refresh token", async () => {
      await expect(authService.refreshToken("invalid-token")).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("validateToken", () => {
    it("should return the user payload for a valid token", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      const authResponse = await authService.createSession(loginInput);
      const result = await authService.validateToken(authResponse.access_token);

      expect(result).toEqual(authResponse.admin);
    });

    it("should throw UnauthorizedError for invalid token", async () => {
      await expect(authService.validateToken("invalid-token")).rejects.toThrow(UnauthorizedError);
    });

    it("should throw AppError when JWT_SECRET is missing", async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      try {
        expect(() =>
          authService.generateToken({
            id: 1,
            email: "admin@example.com",
            name: "Admin",
            role: "admin",
          })
        ).toThrow(AppError);
      } finally {
        process.env.JWT_SECRET = originalSecret;
      }
    });
  });

  describe("validatePermission", () => {
    it("should return true for a valid token", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      const authResponse = await authService.createSession(loginInput);

      await expect(authService.validatePermission(authResponse.access_token)).resolves.toBe(true);
    });

    it("should return false for an invalid token", async () => {
      await expect(authService.validatePermission("invalid-token")).resolves.toBe(false);
    });

    it("should return false when token validation resolves no admin", async () => {
      jest.spyOn(authService, "validateToken").mockResolvedValue(null as never);

      await expect(authService.validatePermission("token")).resolves.toBe(false);
    });
  });

  describe("logout", () => {
    it("should resolve without error", async () => {
      await expect(authService.logout("any-token")).resolves.toBeUndefined();
    });
  });
});
