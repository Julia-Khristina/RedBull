import { createAuthService } from "../src/services/authService";
import { AuthResponse, LoginInput } from "../src/models/auth";
import { UnauthorizedError } from "../src/errors/AppError";

describe("authService", () => {
  let mockAdminRepository: any;
  let authService: ReturnType<typeof createAuthService>;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.ADMIN_PASSWORD = "adminpass";
  });

  beforeEach(() => {
    mockAdminRepository = {
      findByEmail: jest.fn(),
    };
    authService = createAuthService(mockAdminRepository);
  });

  describe("login", () => {
    it("should return auth response for valid admin credentials", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };
      const expectedUser = { id: 1, email: "admin@example.com", name: "Admin", role: "admin" };

      mockAdminRepository.findByEmail.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@example.com",
        area: "TI",
        password: "ignored",
        created_at: "",
      });

      const result = await authService.createSession(loginInput);

      expect(result.user).toEqual(expectedUser);
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.refreshToken).toEqual(result.accessToken);
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
      const result = await authService.refreshToken(authResponse.refreshToken);

      expect(result.user).toEqual(authResponse.user);
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
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
      const result = await authService.validateToken(authResponse.accessToken);

      expect(result).toEqual(authResponse.user);
    });

    it("should throw UnauthorizedError for invalid token", async () => {
      await expect(authService.validateToken("invalid-token")).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("logout", () => {
    it("should resolve without error", async () => {
      await expect(authService.logout("any-token")).resolves.toBeUndefined();
    });
  });
});
