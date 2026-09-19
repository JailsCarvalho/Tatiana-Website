# Atelier Véra — Galeria de Artes (Portugal)

## Problema original
> Preciso de um website para uma galeria de Artes, o site devera ter cores neutras de preferencia branca e preta, quero um site dinamico com animacoes de entradas, mas sempre fugindo do padrao IA. Nao use emojis nem sombras no design. Usa o gsap para dar dinamicas e tambem imagem placeholder que depois eu vou substituir.  
> O site vai ter uma pagina home, sobre mim, workshops, Aulas e uma pagina de blog que podemos avancar depois.  
> Gostei desse tipo de design https://kononenkogroup.com/

## Escolhas do utilizador
- Nome/artista: placeholder "Atelier Véra" (utilizador irá substituir)
- Workshops/Aulas: apenas páginas informativas (sem sistema de pagamentos)
- Contact form: envia email via Resend (Emergent-managed)
- Idioma: Português de Portugal
- Tipografia editorial serif — aprovada Cormorant Garamond + Manrope

## Arquitectura
- Backend: FastAPI + MongoDB
- Frontend: React 19 + React Router + Tailwind + framer-motion + GSAP + Lenis + react-fast-marquee
- Email: proxy Emergent Resend em `https://integrations.emergentagent.com/api/v1/email/send`

## Rotas
- `/` Home — hero cinético (line-mask reveal), marquee editorial, obras recentes (grid assimétrico), manifesto numerado (3 capítulos), CTA
- `/sobre` — retrato B&W, biografia scroll-reveal, citação display italic, timeline
- `/workshops` — lista editorial numerada, hover preview, formulário de inscrição
- `/aulas` — 2-col (imagem estúdio + lista de aulas), formulário
- `/blog` — lista minimalista de artigos, placeholder para futuro

## API `/api`
- `GET /` health
- `POST /contact` cria mensagem + envia email ao owner (via Resend proxy)
- `GET /contact` (admin) lista mensagens
- `GET /workshops` conteúdo estático programa 2026
- `GET /aulas` conteúdo estático programa contínuo
- `GET /blog` posts placeholder

## Ambiente
- `backend/.env`: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME=Atelier Véra`, `GALLERY_OWNER_EMAIL`
- Utilizador deve substituir `GALLERY_OWNER_EMAIL` pelo email real da galeria

## Implementado (2026-07-21)
- 5 páginas completas com data-testids
- Motion premium: mask reveal em H1s, scroll-reveals framer-motion, marquee editorial serif, spotlight nas imagens, parallax subtil no hero
- Formulário de contacto funcional a enviar email via Resend
- Design monocromático estrito (0 sombras, 0 arredondamentos, sem emojis)
- Terminologia editorial uniformizada: «Ateliê/ateliê» passou a «Atelier/atelier» em todo o conteúdo visível (validado em 2026-09-09).
- Texto actualizado (2026-09-11): apresentação da hero expandida para incluir todos os níveis e título dos serviços alterado para «Funcionamento do atelier por aula de desenho».
- Redes sociais actualizadas (2026-09-11): ligações directas para Facebook e Instagram oficiais da Galeria-Atelier Ícone.
- Página Sobre ajustada (2026-09-11): removida a secção de citação filosófica, mantendo a passagem directa da biografia para a cronologia.
- Workshops actualizados (2026-09-11): novo vídeo fornecido apresentado em destaque na galeria, título alterado para «O atelier em movimento» e informações de preço removidas da página.
- Materiais actualizados (2026-09-11): título, introdução, benefícios e mensagem final substituídos pelo novo conteúdo, preservando as dez entradas da lista de materiais.
- Página Aulas actualizada (2026-09-11): substituído o estado «em construção» pela apresentação editorial da aula de Pintura Acrílica, destinada a iniciantes.
- Página Aulas redesenhada (2026-09-11): arquitectura escalável baseada numa lista de técnicas, detalhe dinâmico por aula e galeria própria com os três vídeos fornecidos. Inclui lightbox acessível, adaptação mobile e validação de frontend a 100% (`iteration_2`).
- Página Aulas refinada (2026-09-11): tamanhos tipográficos harmonizados com as restantes páginas; frase introdutória passou a ocupar toda a largura útil sem quebra de linha em desktop.
- Galeria de Pintura Acrílica actualizada (2026-09-12): incluído o quarto vídeo fornecido, disponível também no leitor ampliado.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Carvão e Grafite», com descrição de desenho de observação e uma galeria própria dos quatro vídeos fornecidos.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Pintura a Óleo», com a descrição fornecida e uma galeria exclusiva dos quatro vídeos associados.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Pintura em Aguarela», com os três vídeos fornecidos e ligação para solicitar uma aula experimental através dos contactos do atelier.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Lápis de Cor», com a descrição fornecida, três vídeos associados e ligação para solicitar uma aula experimental.
- Contacto configurado (2026-09-12): formulários passam a enviar para `galeriaicone@gmail.com` através da integração gerida de email, com dados do formulário tratados de forma segura. Adicionado botão flutuante de WhatsApp para `+351 967 311 015`.
- Botão WhatsApp refinado (2026-09-12): ícone vectorial interno substituído pelo mais recente ícone PNG verde de WhatsApp fornecido pelo utilizador.
- Página Aulas refinada (2026-09-12): removido o botão de aula experimental; texto descritivo secundário alinhado sob o texto principal, sem margem lateral ou espaçamento vertical excessivo, para uniformizar todas as técnicas.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Pastel de Óleo», com descrição e três vídeos próprios.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Técnicas Mistas», com descrição e três vídeos próprios.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Tinta da China», com descrição e quatro vídeos próprios.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Canetas Acrílicas», com descrição e três vídeos próprios.
- Catálogo de Aulas expandido (2026-09-12): adicionada a técnica «Canetas Copic», com a descrição fornecida e vídeo próprio; a galeria adapta-se a uma única entrada sem espaço vazio.
- Secção de Materiais refinada (2026-09-12): título reduzido para harmonizar com a hierarquia tipográfica do site e removido o emoji do cabeçalho.
- SEO on-page implementado (2026-06): domínio galeriaicone.pt. Título/descrição/keywords/canónico e Open Graph únicos por página via componente `Seo.jsx` (hoisting nativo do React 19); dados estruturados JSON-LD (LocalBusiness + EducationalOrganization com morada, telefone, horário e redes) no `index.html`; `robots.txt` e `sitemap.xml`; `lang="pt-PT"`; ajustes subtis de texto na página Aulas com palavras-chave alvo (Aulas de pintura/desenho em Coimbra). Verificado: canónico único por rota, títulos únicos.

## Backlog (P1)
- Página Blog dedicada por artigo (detalhe)
- CMS/painel simples para editar workshops/aulas/blog
- Multi-idioma (PT-EN)
- Sitemap + SEO metatags por página ✅ (feito 2026-06)
- Imagens reais fornecidas pelo utilizador (substituir placeholders Pexels)

## Backlog (P2)
- Sistema de inscrições com pagamento (Stripe) para workshops
- Newsletter (Resend + double opt-in)
- Loja de obras / catálogo com ficha por peça
