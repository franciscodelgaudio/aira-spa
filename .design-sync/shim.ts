// O codigo do site le process.env (convencao do Next, que injeta o objeto no
// navegador). No Claude Design nao existe Next: sem isto lib/site.ts quebraria
// ao carregar. As midias apontam para o site publicado, ja que /uploads e
// /LOGOTIPO-transparente.png nao existem dentro do projeto de design.
const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
g.process ??= {};
g.process.env ??= {};
g.process.env.NEXT_PUBLIC_ASSET_BASE ??= "https://www.airaspa.com.br";

export {};
