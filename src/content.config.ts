import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const produtos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produtos' }),
  schema: z.object({
    nome: z.string(),
    slug: z.string(),
    categoria: z.enum(['mdf', 'pinus', 'cortes', 'acessorios']),
    descricao: z.string(),
    dimensoes: z.string(),
    preco: z.number(),
    destaque: z.boolean().default(false),
    imagens: z.array(z.string()).default([]),
    whatsapp_msg: z.string(),
  }),
});

export const collections = { produtos };
