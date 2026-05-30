import { createAuthService } from "../src/services/authService";
import { AuthResponse, LoginInput } from "../src/models/auth";
import { UnauthorizedError } from "../src/errors/AppError";

describe("authService", () => {
  let mockAdministradorRepository: any;
  let authService: ReturnType<typeof createAuthService>;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.ADMIN_PASSWORD = "adminpass";
  });

  beforeEach(() => {
    mockAdministradorRepository = {
      findByEmail: jest.fn(),
    };
    authService = createAuthService(mockAdministradorRepository);
  });

  describe("login", () => {
    it("should return auth response for valid admin credentials", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };
      const expectedUser = { id: 1, email: "admin@example.com", name: "Admin", role: "admin" };

      mockAdministradorRepository.findByEmail.mockResolvedValue({
        id: 1,
        nome: "Admin",
        email: "admin@example.com",
        area: "TI",
        senha: "ignored",
        criado_em: "",
      });

      const result = await authService.autenticar(loginInput);

      expect(result.user).toEqual(expectedUser);
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.refreshToken).toEqual(result.accessToken);
    });

    it("should throw UnauthorizedError for invalid email", async () => {
      const loginInput: LoginInput = { email: "invalid@example.com", password: "adminpass" };

      mockAdministradorRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.autenticar(loginInput)).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError for wrong password", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "wrongpass" };

      mockAdministradorRepository.findByEmail.mockResolvedValue({
        id: 1,
        nome: "Admin",
        email: "admin@example.com",
        area: "TI",
        senha: "ignored",
        criado_em: "",
      });

      await expect(authService.autenticar(loginInput)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("refresh", () => {
    it("should issue a new token for a valid refresh token", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };

      mockAdministradorRepository.findByEmail.mockResolvedValue({
        id: 1,
        nome: "Admin",
        email: "admin@example.com",
        area: "TI",
        senha: "ignored",
        criado_em: "",
      });

      const authResponse = await authService.autenticar(loginInput);
      const result = await authService.refreshToken(authResponse.refreshToken);

      expect(result.user).toEqual(authResponse.user);
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should throw UnauthorizedError for invalid refresh token", async () => {
      await expect(authService.refreshToken("invalid-token")).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("getCurrentUser", () => {
    it("should return the user payload for a valid token", async () => {
      const loginInput: LoginInput = { email: "admin@example.com", password: "adminpass" };

      mockAdministradorRepository.findByEmail.mockResolvedValue({
        id: 1,
        nome: "Admin",
        email: "admin@example.com",
        area: "TI",
        senha: "ignored",
        criado_em: "",
      });

      const authResponse = await authService.autenticar(loginInput);
      const result = await authService.getCurrentUser(authResponse.accessToken);

      expect(result).toEqual(authResponse.user);
    });

    it("should throw UnauthorizedError for invalid token", async () => {
      await expect(authService.getCurrentUser("invalid-token")).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("logout", () => {
    it("should resolve without error", async () => {
      await expect(authService.logout("any-token")).resolves.toBeUndefined();
    });
  });
});
