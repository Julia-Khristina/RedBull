import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthResponse, LoginInput } from "../models/auth";
import { AppError, UnauthorizedError } from "../errors/AppError";
import { adminRepository } from "../repositories/adminRepository";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET não configurado", 500);
  }
  return secret;
}

function getAdminPasswordHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new AppError("ADMIN_PASSWORD_HASH não configurado", 500);
  }
  return hash;
}

export function createAuthService(repo = adminRepository) {
  return {
    async createSession(input: LoginInput): Promise<AuthResponse> {
      const admin = await repo.findByEmail(input.email);
      const adminPasswordHash = getAdminPasswordHash();
      const passwordMatch = await bcrypt.compare(input.password, adminPasswordHash);

      if (!admin || !passwordMatch) {
        throw new UnauthorizedError("Email ou senha inválidos");
      }

      const authenticatedAdmin: AuthResponse["admin"] = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "admin" as const,
      };

      const access_token = this.generateToken(authenticatedAdmin);

      return {
        access_token,
        refresh_token: access_token,
        admin: authenticatedAdmin,
      };
    },

    async refreshToken(token: string): Promise<AuthResponse> {
      const authenticatedAdmin = await this.validateToken(token);
      const access_token = this.generateToken(authenticatedAdmin);

      return {
        access_token,
        refresh_token: access_token,
        admin: authenticatedAdmin,
      };
    },

    async logout(_token: string): Promise<void> {
      return;
    },

    async validateToken(token: string): Promise<AuthResponse["admin"]> {
      const secret = getJwtSecret();

      try {
        const decoded = jwt.verify(token, secret) as {
          admin: AuthResponse["admin"];
        };

        if (!decoded || typeof decoded !== "object" || !decoded.admin) {
          throw new UnauthorizedError("Token inválido");
        }

        return decoded.admin;
      } catch {
        throw new UnauthorizedError("Token inválido ou expirado");
      }
    },

    async validatePermission(token: string): Promise<boolean> {
      try {
        const admin = await this.validateToken(token);
        if (!admin) return false;
        return true;
      } catch {
        return false;
      }
    },

    generateToken(admin: AuthResponse["admin"]): string {
      const secret = getJwtSecret();

      return jwt.sign({ admin }, secret, {
        algorithm: "HS256",
        expiresIn: "8h",
      });
    },
  };
}

export const authService = createAuthService();
