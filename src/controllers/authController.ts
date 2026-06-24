import { Request, Response } from "express";
import { authService } from "../services/authService";
import { AppError } from "../errors/AppError";

function getAuthenticationToken(req: Request): string {
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
  async createSession(req: Request, res: Response): Promise<void> {
    const result = await authService.createSession(req.body);
    res.cookie("rb24_token", result.access_token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.status(200).json(result);
  },

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refresh_token = req.body.refresh_token ?? req.body.refreshToken;

    if (!refresh_token) {
      throw new AppError("Refresh token não informado", 400);
    }

    const token = await authService.refreshToken(refresh_token);
    res.status(200).json(token);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const token = getAuthenticationToken(req);
    await authService.logout(token);
    res.status(204).send();
  },
};
