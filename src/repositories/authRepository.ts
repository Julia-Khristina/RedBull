import { Admin } from "../models/admin";

export const authRepository = {
  async findByEmail(email: string): Promise<Admin | null> {
    throw new Error("authRepository.findByEmail not implemented");
  },
};
