# 🎂 Sistema de Aniversariantes TCI

Sistema web moderno para visualização de aniversariantes da empresa, desenvolvido pela equipe de TI da TCI Modulares.

---

## 📋 Descrição

Interface web responsiva que exibe aniversariantes do mês atual e permite navegação por todos os meses do ano. Com design moderno, validação de dados e suporte a fotos, facilita a celebração e integração da equipe.

### ✨ Características Principais

- **Visualização Automática**: 3 primeiros aniversariantes do mês atual
- **Navegação Intuitiva**: Setas e dropdown para alternar entre meses
- **Fotos ou Avatares**: URLs externas, fotos locais ou iniciais coloridas
- **100% Responsivo**: Desktop, tablet e mobile
- **Validação Inteligente**: Detecção automática de formato CSV
- **Zero Dependências**: HTML, CSS e JavaScript puro

---

## 📁 Estrutura do Projeto

```
ANIVERSARIANTES-TCI/
├── index.html                         # Página principal (mês atual)
├── todos_aniversariantes.html        # Página completa (todos os meses)
├── Css/
│   ├── styles.css
│   └── todos_aniversariantes.css
├── Js/
│   ├── main.js
│   └── todos_aniversariantes.js
├── Data/
│   └── dados.csv                      # Arquivo CSV principal
└── Photos/                            # Fotos dos colaboradores (opcional)
```

---

## 🚀 Instalação Rápida

### Uso Local
1. Clone ou baixe o projeto
2. Edite `Data/dados.csv` com os dados dos colaboradores
3. Adicione fotos em `Photos/` (opcional)
4. Abra `index.html` no navegador

### Instalação no SharePoint

1. **Criar Biblioteca**
   - Acesse "Conteúdo do Site"
   - Crie biblioteca "Aniversariantes"

2. **Upload dos Arquivos**
   - Faça upload mantendo a estrutura de pastas

3. **Adicionar Web Part**
   - Edite a página desejada
   - Adicione Web Part "Incorporar Código"
   - Insira o código:

```html
<iframe 
    src="/sites/seu-site/Aniversariantes/index.html" 
    width="100%" 
    height="650px" 
    frameborder="0">
</iframe>
```

4. **Configurar Permissões**
   - Garanta permissão de Leitura aos usuários

---

## 📄 Formato do CSV

### Estrutura Obrigatória

| Coluna | Obrigatória | Exemplo |
|--------|-------------|---------|
| Nome | ✅ | João da Silva |
| Departamento | ✅ | Tecnologia e Comunicação |
| Cargo | ✅ | Desenvolvedor |
| Data | ✅ | 15/06/1990 ou 15/06 |
| Foto | ❌ | Photos/joao.jpg |

### Exemplo

```csv
Nome,Departamento,Cargo,Data,Foto
João da Silva,Tecnologia e Comunicação,Desenvolvedor,15/06/1990,Photos/joao.jpg
Maria Santos,Recursos Humanos,Analista,23/06,https://i.imgur.com/abc123.jpg
Pedro Costa,Financeiro,Contador,08/06/1985,
```

### Formatos Aceitos
- **Separadores**: `,` `;` `\t` (detecção automática)
- **Datas**: `DD/MM/AAAA` ou `DD/MM`
- **Encoding**: UTF-8 (recomendado)

---

## 📸 Fotos

### Opção 1: Fotos Locais (Recomendado)
```csv
Nome,Departamento,Cargo,Data,Foto
João Silva,TI,Dev,15/06,Photos/joao-silva.jpg
```
- Tamanho ideal: 400x400px
- Peso: < 200KB

### Opção 2: Imgur
1. Acesse [imgur.com](https://imgur.com)
2. Upload da foto
3. Copie link direto da imagem

```csv
Nome,Departamento,Cargo,Data,Foto
João Silva,TI,Dev,15/06,https://i.imgur.com/ABC123.jpg
```

### Opção 3: Sem Foto (Avatar Automático)
```csv
Nome,Departamento,Cargo,Data,Foto
João Silva,TI,Dev,15/06,
```
Gera avatar colorido com iniciais automaticamente.

---

## 🏢 Departamentos Válidos

- Diretoria
- Administrativo
- Engenharia
- Jurídico
- Financeiro
- Suprimentos
- Recursos Humanos / Pessoal
- Contábil / Fiscal
- Tecnologia e Comunicação

**Sistema ignora acentos e maiúsculas/minúsculas**

### Adicionar Novos Departamentos
Edite `main.js` e `todos_aniversariantes.js`:

```javascript
const departamentosValidos = [
    'Diretoria',
    'Marketing',     // ← Adicione aqui
    'Vendas'        // ← Novo departamento
];
```

---

## 🔧 Solução de Problemas

### ❌ "Nenhum arquivo encontrado"
- Verifique se `dados.csv` está em `Data/`
- Confirme o nome do arquivo

### ❌ "Colunas obrigatórias não encontradas"
- Cabeçalho deve ter: Nome, Departamento, Cargo, Data
- Sem espaços extras: `Nome,Departamento,Cargo,Data`

### ❌ "Departamento inválido"
- Use departamentos da lista válida
- Ou adicione novo departamento no código

### ❌ Fotos não carregam
- ❌ Não use Google Drive (problema de CORS)
- ✅ Use Imgur ou fotos locais
- Verifique se o caminho está correto
- Teste o link da foto no navegador

### ❌ Caracteres estranhos (Ã, ç)
**No Excel**: Salvar Como → CSV UTF-8  
**No LibreOffice**: Encoding → Unicode (UTF-8)

### 🔍 Debug
Pressione F12 e veja o Console:
```javascript
console.log('Dados:', dadosCompletos);
console.log('Total:', dadosCompletos.length);
```

---

## ⚙️ Personalização

### Alterar Cores
Edite `styles.css`:

```css
:root {
    --primary-dark: #2B3D7A;      /* Azul TCI */
    --accent-aqua: #5DCBDC;       /* Aqua */
}
```

### Alterar Quantidade de Cards
Edite `main.js`:

```javascript
// Altere 3 para o número desejado
const aniversariantesLimitados = aniversariantesMes.slice(0, 3);
```

### Aceitar Outros Nomes de CSV
Edite `main.js` e `todos_aniversariantes.js`:

```javascript
const nomesPlanilha = [
    'dados.csv',
    'aniversariantes.csv',
    'colaboradores.csv'  // ← Adicione aqui
];
```

---

## 📊 Especificações Técnicas

### Tecnologias
- HTML5, CSS3, JavaScript ES6+
- Fetch API, SessionStorage
- Sem frameworks ou bibliotecas

### Compatibilidade
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- SharePoint Online, 2019, 2016
- Desktop, Tablet, Mobile

### Performance
- Carregamento: < 1 segundo
- Tamanho: ~50KB (sem fotos)
- Suporta até 5000 registros

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -am 'Adiciona funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📞 Suporte

### Ao reportar problemas, inclua:
- Navegador e versão
- Sistema operacional
- Mensagem de erro (Console F12)
- Passos para reproduzir

---

## 📝 Changelog

### Versão 1.0.0 (Dezembro 2024)
- ✨ Lançamento inicial
- 🎨 Interface moderna com paleta TCI
- 📅 Navegação por meses
- 📸 Suporte a fotos
- ✅ Validação de departamentos
- 📱 Design responsivo
- 🌐 Compatibilidade SharePoint

---

## 🚀 Roadmap

### Próximas Versões
- [ ] Filtro por departamento
- [ ] Busca por nome
- [ ] Exportar para PDF
- [ ] Modo escuro
- [ ] Notificações por e-mail
- [ ] Painel administrativo

---

## 📜 Licença

Desenvolvido para uso interno da **TCI Modulares**.

---

## ✨ Créditos

**Desenvolvido por**: Equipe de TI da TCI Modulares  
**Versão**: 1.0.0  
**Data**: Dezembro 2025
**Última atualização**: 10/12/2025

---