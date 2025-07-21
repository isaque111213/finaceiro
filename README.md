# Template do Site de Controle Financeiro

Este é o template pronto para deploy no Netlify do seu site de controle financeiro.

## Como fazer deploy no Netlify:

### Opção 1: Deploy via Drag & Drop
1. Acesse [netlify.com](https://netlify.com)
2. Faça login ou crie uma conta
3. Na página principal, arraste toda esta pasta para a área "Want to deploy a new site without connecting to Git?"
4. Aguarde o upload e deploy automático

### Opção 2: Deploy via Git
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos desta pasta para o repositório
3. No Netlify, conecte seu repositório GitHub
4. Configure o build:
   - Build command: (deixe vazio)
   - Publish directory: (deixe vazio ou coloque "/")

## Arquivos inclusos:
- `index.html` - Página principal
- `assets/` - CSS e JavaScript compilados
- `favicon.ico` - Ícone do site
- `_redirects` - Configuração para SPA (Single Page Application)

## Funcionalidades do site:
- Controle de receitas e despesas
- Dashboard com gráficos
- Interface responsiva
- Tema claro/escuro
- Salvamento automático no localStorage

O site está pronto para uso imediato após o deploy!

