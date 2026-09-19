# Deploy na Vercel

Este projecto usa o modelo **Services** da Vercel (ver `vercel.json` na raiz):
um único projecto Vercel com dois serviços — `frontend/` (React, estático) e
`backend/` (FastAPI, função Python) — servidos no mesmo domínio, sem CORS.

> **Nota:** Services está em Beta. Se o projecto na Vercel não tiver acesso,
> pede para activar em vercel.com/docs/services.

## 1. Criar o projecto na Vercel

1. Importa o repositório em vercel.com/new.
2. A Vercel deve detectar o `vercel.json` na raiz e construir os dois
   serviços automaticamente — não precisas de mexer nas definições de
   build/output no dashboard.

## 2. Base de dados (Neon)

Já tens isto configurado localmente. Confirma que a `DATABASE_URL` que vais
colar na Vercel usa o endpoint com **`-pooler`** (obrigatório em serverless)
e o formato `postgresql+asyncpg://...`.

## 3. Vercel Blob Storage (upload de imagens/vídeo)

1. No projecto Vercel → **Storage** → **Create Database** → **Blob**.
2. Acesso: **Public** (as imagens/vídeos do site são públicas).
3. Ao ligar o store ao projecto, a Vercel cria automaticamente a variável
   `BLOB_READ_WRITE_TOKEN` — não precisas de a copiar à mão.
4. **Importante:** o upload de ficheiros grandes (vídeo) usa as funções
   `create_multipart_upload` / `upload_part` / `complete_multipart_upload`
   do SDK oficial `vercel.blob`, implementadas a partir da documentação —
   **nunca testadas contra um Blob store real**, porque não havia nenhum
   disponível durante o desenvolvimento. Depois do primeiro deploy, testa:
   - Carregar uma imagem pequena (deve ir num só pedido)
   - Carregar um vídeo grande, tipo um export do WhatsApp (deve dividir-se
     em partes automaticamente — vê no painel de rede do browser)

   Se o upload em partes falhar, o mais provável é o nome dos campos que o
   SDK devolve em `create_multipart_upload`/`upload_part` (`upload_id`,
   `key`, `part_number`, `etag`) não bater certo com o que assumi em
   `backend/storage.py` — diz-me o erro exacto e corrijo.

## 4. Variáveis de ambiente a definir na Vercel

No projecto → **Settings → Environment Variables**, define para
**Production** (e Preview, se quiseres testar antes):

| Variável | Valor | Nota |
|---|---|---|
| `DATABASE_URL` | connection string da Neon, com `-pooler` | igual ao `backend/.env` local |
| `JWT_SECRET` | uma string aleatória **diferente** da de desenvolvimento | gera com `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `JWT_TTL_DAYS` | `7` | opcional, é o valor por omissão |
| `APP_ENV` | `production` | activa o cookie de sessão `Secure` (obrigatório em HTTPS) |
| `CORS_ORIGINS` | o domínio de produção, ex: `https://galeriaicone.pt` | frontend e backend ficam no mesmo domínio graças ao Services, isto é só rede de segurança |
| `EMERGENT_EMAIL_KEY` | a chave actual | para o email de contacto continuar a funcionar |
| `EMAIL_FROM_NAME` | `Atelier Galeria Ícone` | |
| `GALLERY_OWNER_EMAIL` | o email real da galeria | |
| `BLOB_READ_WRITE_TOKEN` | (automático) | criado pela Vercel ao ligares o Blob store — não definir à mão |
| `REACT_APP_BACKEND_URL` | **deixar vazio** (string vazia, não por definir) | ver nota abaixo |

**Sobre `REACT_APP_BACKEND_URL` vazio:** como o frontend e o backend ficam no
mesmo domínio (o `vercel.json` reescreve `/api/*` para o serviço do backend),
o frontend deve chamar `/api/...` como caminho relativo, não um URL absoluto
para outro domínio. Uma variável **por definir** dá `undefined/api` (erro);
uma variável **vazia** dá `/api` (correcto). No dashboard da Vercel, cria a
variável com o campo de valor em branco.

## 5. Depois do primeiro deploy

- Cria o utilizador do painel apontado à base de dados de produção:
  ```
  DATABASE_URL="<a mesma que puseste na Vercel>" python scripts/seed_admin.py --email <email> --password "<password>"
  ```
  (corre isto a partir do teu computador, dentro de `backend/`, com o venv
  de desenvolvimento activo — `requirements-dev.txt` já tem tudo o que é preciso.)
- Corre as migrações Alembic contra a Neon de produção da mesma forma —
  `alembic upgrade head` a partir do teu computador, nunca dentro da função
  serverless.
- Testa o painel completo em produção: login, criar/editar/apagar em
  Workshops, Aulas e Agenda, e os dois tamanhos de upload (ver secção 3).

## O que já foi testado localmente (funciona)

- Todo o fluxo de upload local em disco — pedido único e em partes —
  incluindo reconstrução byte-a-byte do ficheiro a partir das partes.
- O `vercel.json` e a estrutura de serviços seguem exactamente a
  documentação oficial actual da Vercel (Services, Beta) — mas nunca foi
  implantado de facto, porque este ambiente não tem acesso à Vercel.
