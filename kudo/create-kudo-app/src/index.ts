#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { createRequire } from 'node:module';
import { confirm, isCancel, cancel, outro } from '@clack/prompts';
import pc from 'picocolors';
import { runInteractivePrompts, type UserChoices } from './prompts.js';
import { copyBaseTemplates, copyPolicies, copyAiTooling } from './utils/copy-template.js';
import { logger } from './utils/logger.js';
import { DOMINIOS, PACKAGE_MANAGERS, type DominioId, type PackageManager } from './constants.js';

const { version } = createRequire(import.meta.url)('../package.json') as { version: string };

const program = new Command();

interface CliOptions {
  packageManager?: PackageManager;
  yes?: boolean;
  ai?: boolean;
}

program
  .name('create-kudo-app')
  .description('CLI para crear nuevas aplicaciones Kudo con templates de políticas de Ciberseguridad')
  .version(version)
  .argument('[project-name]', 'Nombre del proyecto')
  .option('-p, --package-manager <pm>', 'Package manager a usar (npm, pnpm, yarn)')
  .option('-y, --yes', 'Usar los valores por defecto sin preguntas (requiere el nombre del proyecto)')
  .option('--no-ai', 'No incluir el servidor MCP, los agentes ni las skills de IA')
  .action(async (projectName: string | undefined, options: CliOptions) => {
    try {
      if (options.packageManager && !PACKAGE_MANAGERS.includes(options.packageManager)) {
        throw new Error(`Package manager no soportado: ${options.packageManager}. Usa npm, pnpm o yarn.`);
      }

      let choices: UserChoices;
      if (options.yes) {
        if (!projectName) throw new Error('Con --yes debes indicar el nombre del proyecto: create-kudo-app mi-sgx --yes');
        if (!/^[a-z0-9-_]+$/i.test(projectName)) {
          throw new Error('El nombre solo puede contener letras, números, guiones y guiones bajos');
        }
        choices = {
          projectName,
          packageManager: options.packageManager ?? 'pnpm',
          selectedDominios: Object.keys(DOMINIOS) as DominioId[],
          includeBlog: true,
          includeAi: options.ai !== false,
        };
      } else {
        choices = await runInteractivePrompts(projectName);
        if (options.ai === false) choices.includeAi = false;
      }
      const packageManager = options.packageManager || choices.packageManager;

      const targetDir = path.resolve(process.cwd(), choices.projectName);

      if (await fs.pathExists(targetDir)) {
        if (options.yes) throw new Error(`El directorio ${choices.projectName} ya existe`);
        const shouldOverwrite = await confirm({
          message: `El directorio ${pc.cyan(choices.projectName)} ya existe. ¿Quieres sobrescribirlo?`,
          initialValue: false,
        });

        if (isCancel(shouldOverwrite) || !shouldOverwrite) {
          cancel('Operación cancelada');
          process.exit(0);
        }

        await fs.remove(targetDir);
      }

      await fs.ensureDir(targetDir);

      logger.title('🚀 Creando tu aplicación Kudo...');
      const pasos = choices.includeAi ? 3 : 2;

      logger.step(1, pasos, 'Copiando estructura base del proyecto...');
      await copyBaseTemplates({
        projectName: choices.projectName,
        targetDir,
        packageManager,
        includeBlog: choices.includeBlog,
      });

      logger.step(2, pasos, 'Copiando políticas y procedimientos del SGX...');
      const documentos = await copyPolicies(targetDir);

      let ia: { agentes: number; skills: number } | null = null;
      if (choices.includeAi) {
        logger.step(3, pasos, 'Configurando MCP, agentes y skills de IA...');
        ia = await copyAiTooling(targetDir);
      }

      console.log();
      outro(pc.green('✨ ¡Proyecto creado exitosamente!'));

      const run = packageManager === 'npm' ? 'npm run' : packageManager;
      console.log();
      logger.title('📝 Próximos pasos:');
      console.log();
      console.log(pc.cyan(`  cd ${choices.projectName}`));
      console.log(pc.cyan(`  ${packageManager} install`));
      console.log(pc.cyan(`  ${run} dev`));
      console.log();
      logger.info('Tu aplicación estará disponible en http://localhost:3000');

      if (ia) {
        console.log();
        logger.title('🤖 Trabaja con IA:');
        console.log();
        console.log(`  El servidor MCP ${pc.cyan('kudo')} ya está configurado en ${pc.cyan('.mcp.json')}.`);
        console.log(`  Abre el proyecto con tu asistente (por ejemplo ${pc.cyan('claude')}) y usa los agentes:`);
        console.log(pc.dim('  kudo-ciso · kudo-auditor · kudo-redactor-sgx · kudo-respuesta-incidentes'));
        console.log(pc.dim('  kudo-appsec · kudo-arquitecto-nube · kudo-privacidad-ia · kudo-personas-y-proveedores'));
        console.log();
        console.log(`  Otros asistentes: ${pc.cyan('npx skills add PetterVargas/divisioncero.com')}`);
      }
      console.log();
      logger.info('Guía completa: https://divisioncero.com/kudo/sgx/aprovisionamiento');
      console.log();

      logger.info(`Dominios incluidos: ${choices.selectedDominios.join(', ').toUpperCase()}`);
      logger.info(`Documentos del SGX: ${documentos}`);
      if (ia) logger.info(`Agentes: ${ia.agentes} · Skills: ${ia.skills}`);
      if (choices.includeBlog) logger.info('Blog incluido');
      console.log();
    } catch (error) {
      console.error();
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error('Ocurrió un error inesperado');
      }
      process.exit(1);
    }
  });

program.parse();
