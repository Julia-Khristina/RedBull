import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { getSupabaseClient } from "../database/supabaseClient";

const BUCKET = "ocr-images";

export async function uploadImageToStorage(
  imagePath: string,
  originalName?: string
): Promise<string> {
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType =
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  const fileName = `${crypto.randomUUID()}${ext}`;
  const fileBuffer = await fs.readFile(imagePath);

  const supabase = getSupabaseClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Falha ao enviar imagem para Supabase Storage: ${error.message}`
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}
