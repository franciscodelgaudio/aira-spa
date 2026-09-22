import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Exigido por output: "export" — sem isso o Next trata a rota de metadata como
 * dinamica e o build para, porque um export estatico nao tem servidor para
 * responder em tempo de requisicao.
 */
export const dynamic = "force-static";


/**
 * Site institucional de pagina unica: tudo aqui e para ser encontrado, entao a
 * regra e liberar.
 *
 * Os crawlers de IA aparecem nomeados de proposito. Sem regra propria eles caem
 * no "User-Agent: *" e sao liberados do mesmo jeito — a lista existe para que a
 * decisao fique explicita no arquivo, e para que bloquear um deles amanha seja
 * apagar uma linha em vez de reescrever o robots inteiro.
 *
 * Dois papeis diferentes, vale saber qual e qual antes de mexer:
 *  - treino (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended): alimentam
 *    o modelo. Bloquear nao tira o site das respostas de hoje.
 *  - busca/citacao (OAI-SearchBot, Claude-SearchBot, PerplexityBot, e os
 *    agentes -User): sao eles que buscam a pagina na hora de responder e citam
 *    a fonte. Bloquear estes e sumir das respostas de IA.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Bytespider",
  "cohere-ai",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
