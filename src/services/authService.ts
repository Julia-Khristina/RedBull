import "dotenv/config";
import jwt from "jsonwebtoken";
import { AuthResponse, LoginInput } from "../models/auth";
import { AppError, UnauthorizedError } from "../errors/AppError";
import { administradorRepository } from "../repositories/administradorRepository";


function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET não configurado", 500);
  }
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new AppError("ADMIN_PASSWORD não configurado", 500);
  }
  return password;
}

export function createAuthService(repo = administradorRepository) {
  return {
    async autenticar(input: LoginInput): Promise<AuthResponse> {
      const administrador = await repo.findByEmail(input.email);
      const adminPassword = getAdminPassword();

      if (!administrador || input.password !== adminPassword) {
        throw new UnauthorizedError("Email ou senha inválidos");
      }

      const user = {
        id: administrador.id,
        email: administrador.email,
        name: administrador.nome,
        role: "admin" as const,
      };

      const accessToken = this.gerarToken(user);

      return {
        accessToken,
        refreshToken: accessToken,
        user,
      };
    },

    async refreshToken(token: string): Promise<AuthResponse> {
      const user = await this.getCurrentUser(token);
      const accessToken = this.gerarToken(user);

      return {
        accessToken,
        refreshToken: accessToken,
        user,
      };
    },

    async logout(_token: string): Promise<void> {
      return;
    },

    async getCurrentUser(token: string): Promise<AuthResponse["user"]> {
      const secret = getJwtSecret();

      try {
        const decoded = jwt.verify(token, secret) as { user: AuthResponse["user"] };

        if (!decoded || typeof decoded !== "object" || !decoded.user) {
          throw new UnauthorizedError("Token inválido");
        }

        return decoded.user;
      } catch {
        throw new UnauthorizedError("Token inválido ou expirado");
      }
    },

    validarPermissao(token: string): boolean {
      try {
        const user = this.getCurrentUser(token);
        if (!user) return false;
        return true;
      } catch {
        return false;
      }
    },

    gerarToken(user: AuthResponse["user"]): string {
      const secret = getJwtSecret();

      return jwt.sign({ user }, secret, {
        algorithm: "HS256",
        expiresIn: "8h",
      });
    },
  };
}

// Export default instance for production use
export const authService = createAuthService();