import { AuthResponse, LoginInput, RegisterInput } from "../models/auth";

export const authRepository = {
  async findByEmail(email: string): Promise<any | null> {
    throw new Error("authRepository.findByEmail not implemented");
  },

  async register(dados: RegisterInput): Promise<AuthResponse> {
    throw new Error("authRepository.register not implemented");
  },

  async login(dados: LoginInput): Promise<AuthResponse | null> {
    throw new Error("authRepository.login not implemented");
  },

  async refresh(refreshToken: string): Promise<AuthResponse | null> {
    throw new Error("authRepository.refresh not implemented");
  },

  async logout(token: string): Promise<void> {
    throw new Error("authRepository.logout not implemented");
  },

  async getCurrentUser(token: string): Promise<any | null> {
    throw new Error("authRepository.getCurrentUser not implemented");
  },
};