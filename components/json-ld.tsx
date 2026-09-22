import { structuredData } from "@/lib/structured-data";

/**
 * O `<` escapado impede que qualquer string do conteudo feche o <script> cedo
 * e vire HTML. O JSON continua valido: < e o mesmo caractere.
 */
const json = JSON.stringify(structuredData).replace(/</g, "\\u003c");

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // O conteudo e nosso e ja esta serializado; o React nao deve tocar nele.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
