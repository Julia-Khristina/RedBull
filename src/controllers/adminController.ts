import { Request, Response } from "express";
import { createAdminService } from "../services/adminService";
import { adminRepository } from "../repositories/adminRepository";
import { asyncHandler } from "../helpers/asyncHandler";

const adminService = createAdminService(adminRepository);

function omitirSenha(admin: any) {
  if (!admin) return admin;
  const { password, ...seguro } = admin;
  return seguro;
}

export const adminController = {
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const admins = await adminService.findAll();
    const seguros = admins.map((a) => omitirSenha(a));
    res.status(200).json(seguros);
  }),

  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const admin = await adminService.findById(String(id));
    res.status(200).json(omitirSenha(admin));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, area, password } = req.body;
    const admin = await adminService.create({
      name,
      email,
      area,
      password,
    });
    res.status(201).json(omitirSenha(admin));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, area, password } = req.body;
    const admin = await adminService.update(String(id), {
      name,
      email,
      area,
      password,
    });
    res.status(200).json(omitirSenha(admin));
  }),

  delete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await adminService.delete(String(id));
    res.status(204).send();
  }),
};
