import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from './logger.js';
import type { PackageManager } from '../constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'src', 'templates');

export interface CopyTemplateOptions {
  projectName: string;
  targetDir: string;
  packageManager: PackageManager;
  includeBlog?: boolean;
  author?: string;
}

/**
 * Archivos de la plantilla guardados sin punto inicial (npm omite o renombra
 * algunos archivos ocultos al publicar el paquete) y su nombre final.
 */
const DOTFILES: Record<string, string> = {
  gitignore: '.gitignore',
};

export async function copyBaseTemplates(options: CopyTemplateOptions): Promise<void> {
  const { targetDir, projectName, packageManager, includeBlog = true, author = 'DivisionCero' } = options;

  try {
    logger.info('Copiando estructura base del proyecto...');

    await fs.copy(path.join(TEMPLATES_DIR, 'base'), targetDir);
    for (const [origen, destino] of Object.entries(DOTFILES)) {
      const archivo = path.join(targetDir, origen);
      if (await fs.pathExists(archivo)) await fs.move(archivo, path.join(targetDir, destino), { overwrite: true });
    }

    await fs.copy(path.join(TEMPLATES_DIR, 'app'), path.join(targetDir, 'app'));
    await fs.copy(path.join(TEMPLATES_DIR, 'components'), path.join(targetDir, 'components'));
    await fs.copy(path.join(TEMPLATES_DIR, 'lib'), path.join(targetDir, 'lib'));

    // Contenido del framework completo
    const frameworkSource = path.join(TEMPLATES_DIR, 'content', 'framework');
    if (await fs.pathExists(frameworkSource)) {
      await fs.copy(frameworkSource, path.join(targetDir, 'content', 'framework'));
      logger.success('Contenido del framework copiado');
    }

    // Imágenes que usa el contenido (diagramas de procedimientos y OSCAL)
    const publicSource = path.join(TEMPLATES_DIR, 'public');
    if (await fs.pathExists(publicSource)) {
      await fs.copy(publicSource, path.join(targetDir, 'public'));
    }

    if (includeBlog) {
      const blogSource = path.join(TEMPLATES_DIR, 'content', 'blog');
      if (await fs.pathExists(blogSource)) {
        await fs.copy(blogSource, path.join(targetDir, 'content', 'blog'));
        logger.success('Blog copiado');
      }
    }

    await processTemplateFiles(targetDir, {
      PROJECT_NAME: projectName,
      PACKAGE_MANAGER: packageManager,
      AUTHOR: author,
    });

    logger.success('Estructura base copiada exitosamente');
  } catch (error) {
    logger.error('Error al copiar templates base');
    throw error;
  }
}

/**
 * Copia el SGX (políticas, procedimientos, plantillas y correlación con estándares).
 * Devuelve cuántas políticas, procedimientos y plantillas copió.
 */
export async function copyPolicies(targetDir: string): Promise<number> {
  const sgxSource = path.join(TEMPLATES_DIR, 'content', 'sgx');
  const sgxTarget = path.join(targetDir, 'content', 'sgx');

  try {
    await fs.copy(sgxSource, sgxTarget);
    const documentos = (await fs.readdir(path.join(sgxTarget, 'politicas-y-procedimientos'))).filter(
      (f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f),
    );
    logger.success(`SGX copiado: ${documentos.length} documentos y correlación con estándares`);
    return documentos.length;
  } catch (error) {
    logger.error('Error al copiar el SGX');
    throw error;
  }
}

/**
 * Copia la configuración de IA: el servidor MCP de Kudo (.mcp.json) y los
 * agentes y skills de ciberseguridad (.claude/agents y .claude/skills).
 */
export async function copyAiTooling(targetDir: string): Promise<{ agentes: number; skills: number }> {
  const aiSource = path.join(TEMPLATES_DIR, 'ai');
  try {
    await fs.copy(path.join(aiSource, 'mcp.json'), path.join(targetDir, '.mcp.json'));
    await fs.copy(path.join(aiSource, 'claude'), path.join(targetDir, '.claude'));
    const agentes = (await fs.readdir(path.join(targetDir, '.claude', 'agents'))).filter((f) => f.endsWith('.md')).length;
    const skills = (await fs.readdir(path.join(targetDir, '.claude', 'skills'))).length;
    logger.success(`MCP de Kudo configurado, ${agentes} agentes y ${skills} skills copiados`);
    return { agentes, skills };
  } catch (error) {
    logger.error('Error al copiar la configuración de IA');
    throw error;
  }
}

async function processTemplateFiles(
  targetDir: string,
  replacements: Record<string, string>
): Promise<void> {
  const templateFiles = [
    'package.json.template',
    'README.md.template',
    path.join('lib', 'shared.ts.template'),
  ];

  for (const templateFile of templateFiles) {
    const templatePath = path.join(targetDir, templateFile);

    if (await fs.pathExists(templatePath)) {
      let content = await fs.readFile(templatePath, 'utf-8');

      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      const outputPath = templatePath.replace('.template', '');
      await fs.writeFile(outputPath, content, 'utf-8');
      await fs.remove(templatePath);
    }
  }
}
