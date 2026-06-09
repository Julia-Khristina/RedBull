import { Request, Response } from "express";
import { createAdminService } from "../services/adminService";
import { adminRepository } from "../repositories/adminRepository";
import { asyncHandler } from "../helpers/asyncHandler";

const adminService = createAdminService(adminRepository);

function omitPassword(admin: any) {
  if (!admin) return admin;
  const { password, ...safeAdmin } = admin;
  return safeAdmin;
}

export const adminController = {
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const admins = await adminService.findAll();
    const safeAdmins = admins.map((admin) => omitPassword(admin));
    res.status(200).json(safeAdmins);
  }),

  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const admin = await adminService.findById(String(id));
    res.status(200).json(omitPassword(admin));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, area, password } = req.body;
    const admin = await adminService.create({
      name,
      email,
      area,
      password,
    });
    res.status(201).json(omitPassword(admin));
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
    res.status(200).json(omitPassword(admin));
  }),

  delete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await adminService.delete(String(id));
    res.status(204).send();
  }),
};
