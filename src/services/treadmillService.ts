import { Treadmill, TreadmillRepository } from "../models/treadmill";
import { treadmillRepository } from "../repositories/treadmillRepository";

export function createTreadmillService(
  repository: TreadmillRepository = treadmillRepository
) {
  return {
    async getOrCreateDefault(): Promise<Treadmill> {
      const treadmill = await repository.findFirst();

      if (treadmill) return treadmill;

      return repository.create({
        name: "Esteira 1",
        specification: "Esteira padrao para registro operacional manual",
      });
    },
  };
}

export const treadmillService = createTreadmillService();
