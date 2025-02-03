export interface MagicNumberResponse {
  mime: string;
  ext: string 
}

export const MAGIC_NUMBERS: Record<string, MagicNumberResponse> = {
  "25504446": { mime: "application/pdf", ext: "pdf" },
  "89504E47": { mime: "image/png", ext: "png" },
  "FFD8FFDB": { mime: "image/jpeg", ext: "jpg" },
  "FFD8FFE0": { mime: "image/jpeg", ext: "jpg" },
  "FFD8FFE1": { mime: "image/jpeg", ext: "jpg" },
  "47494638": { mime: "image/gif", ext: "gif" },
  "504B0304": { mime: "application/zip", ext: "zip" }, 
  "52617221": { mime: "application/x-rar-compressed", ext: "rar" },
  "7F454C46": { mime: "application/x-executable", ext: "elf" },
  "4D5A": { mime: "application/x-msdownload", ext: "exe" },
};