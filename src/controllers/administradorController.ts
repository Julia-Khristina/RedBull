import { Request, Response } from "express";
import { createAdministradorService } from "../services/administratorService";
import { administradorRepository } from "../repositories/administradorRepository";
import { asyncHandler } from "../helpers/asyncHandler";

const administradorService = createAdministradorService(administradorRepository);

export const administradorController = {
  listar: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const administradores = await administradorService.listar();
    res.status(200).json(administradores);
  }),

  buscarPorId: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const administrador = await administradorService.buscarPorId(id);
    res.status(200).json(administrador);
  }),

  criar: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nome, email, area, senha } = req.body;
    const administrador = await administradorService.criar({
      nome,
      email,
      area,
      senha,
    });
    res.status(201).json(administrador);
  }),

  atualizar: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nome, email, area, senha } = req.body;
    const administrador = await administradorService.atualizar(id, {
      nome,
      email,
      area,
      senha,
    });
    res.status(200).json(administrador);
  }),

  excluir: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await administradorService.excluir(id);
    res.status(204).send();
  }),
};
