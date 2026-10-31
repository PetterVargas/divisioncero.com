export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(
  file: File,
  t: (text: string, variables?: Record<string, string | number>) => string = (text) => text,
): FileValidationResult {
  if (file.size === 0) {
    return { valid: false, error: t('El archivo está vacío.') };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: t('El archivo pesa {size} MB, y el límite es 10 MB.', { size: (file.size / (1024 * 1024)).toFixed(2) }),
    };
  }

  return { valid: true };
}
