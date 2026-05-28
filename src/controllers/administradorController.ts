import { Request, Response } from "express";
import { createAdministradorService } from "../services/administradorService";
import { administradorRepository } from "../repositories/administradorRepository";
import { asyncHandler } from "../helpers/asyncHandler";

const administradorService = createAdministradorService(administradorRepository);

function omitirSenha(administrador: any) {
  if (!administrador) return administrador;
  const { senha, ...seguro } = administrador;
  return seguro;
}

export const administradorController = {
  listar: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const administradores = await administradorService.listar();
    const seguros = administradores.map((a) => omitirSenha(a));
    res.status(200).json(seguros);
  }),

  buscarPorId: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const administrador = await administradorService.buscarPorId(id);
    res.status(200).json(omitirSenha(administrador));
  }),

  criar: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { nome, email, area, senha } = req.body;
    const administrador = await administradorService.criar({
      nome,
      email,
      area,
      senha,
    });
    res.status(201).json(omitirSenha(administrador));
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
    res.status(200).json(omitirSenha(administrador));
  }),

  excluir: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await administradorService.excluir(id);
    res.status(204).send();
  }),
};
