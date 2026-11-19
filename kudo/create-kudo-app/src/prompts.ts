import { intro, text, select, confirm, isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';
import { DOMINIOS, PACKAGE_MANAGERS, type DominioId, type PackageManager } from './constants.js';

export interface UserChoices {
  projectName: string;
  packageManager: PackageManager;
  selectedDominios: DominioId[];
  includeBlog: boolean;
  includeAi: boolean;
}

export async function runInteractivePrompts(defaultProjectName?: string): Promise<UserChoices> {
  console.log();
  intro(pc.bgCyan(pc.black(' create-kudo-app ')));

  const projectName = await text({
    message: '¿Cuál es el nombre de tu proyecto?',
    placeholder: defaultProjectName || 'my-kudo-project',
    defaultValue: defaultProjectName,
    validate: (value) => {
      if (!value) return 'El nombre del proyecto es requerido';
      if (!/^[a-z0-9-_]+$/i.test(value)) {
        return 'El nombre solo puede contener letras, números, guiones y guiones bajos';
      }
    },
  });

  if (isCancel(projectName)) {
    cancel('Operación cancelada');
    process.exit(0);
  }

  const packageManager = await select({
    message: '¿Qué package manager quieres usar?',
    options: PACKAGE_MANAGERS.map((pm) => ({
      value: pm,
      label: pm,
      hint: pm === 'pnpm' ? 'Recomendado' : undefined,
    })),
    initialValue: 'pnpm',
  });

  if (isCancel(packageManager)) {
    cancel('Operación cancelada');
    process.exit(0);
  }

  const includeAi = await confirm({
    message: '¿Incluir el servidor MCP, los agentes y las skills de ciberseguridad para tu asistente de IA?',
    initialValue: true,
  });

  if (isCancel(includeAi)) {
    cancel('Operación cancelada');
    process.exit(0);
  }

  // Incluir todos los dominios por defecto (sin preguntar)
  const selectedDominios: DominioId[] = Object.keys(DOMINIOS) as DominioId[];

  // Incluir blog por defecto (sin preguntar)
  const includeBlog = true;

  return {
    projectName: projectName as string,
    packageManager: packageManager as PackageManager,
    selectedDominios,
    includeBlog,
    includeAi: includeAi as boolean,
  };
}
