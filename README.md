# oticasantos

## Origem dos visitantes

Toda mensagem de WhatsApp enviada pelo site leva uma linha final com a origem do visitante,
por exemplo `(Origem: instagram / bio / promo-10x)`. Assim a loja vê o que trouxe cada contato.
O site guarda só o nome da origem, sem dados pessoais. Visitas sem origem conhecida ("direto") não levam a linha.

Para marcar os links, use parâmetros UTM no endereço do site (troque `SEU-DOMINIO`):

| Onde colocar o link | Endereço |
|---|---|
| Bio do Instagram | `https://SEU-DOMINIO/?utm_source=instagram&utm_medium=bio` |
| Stories ou posts | `https://SEU-DOMINIO/?utm_source=instagram&utm_medium=stories&utm_campaign=promo-10x` |
| Google Meu Negócio | `https://SEU-DOMINIO/?utm_source=google&utm_medium=perfil` |
| Anúncio no Meta | `https://SEU-DOMINIO/?utm_source=meta&utm_medium=anuncio&utm_campaign=nome-da-campanha` |

Sem UTM, o site ainda reconhece anúncios do Google, do Meta e do TikTok (parâmetros `gclid`, `fbclid`, `ttclid`),
o navegador interno do Instagram, do Facebook e do TikTok, e o site de onde a pessoa veio (Google, Facebook e outros).
Use letras minúsculas, números e hífens nas UTM (até 30 caracteres).

