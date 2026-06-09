import { Request, Response } from "express";
import { authService } from "../services/authService";
import { AppError } from "../errors/AppError";

function obterTokenAutenticacao(req: Request): string {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token não informado", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Token não informado", 401);
  }

  return token;
}

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const token = await authService.createSession(req.body);
    res.status(200).json(token);
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token não informado", 400);
    }

    const token = await authService.refreshToken(refreshToken);
    res.status(200).json(token);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const token = obterTokenAutenticacao(req);
    await authService.logout(token);
    res.status(204).send();
  },
};
