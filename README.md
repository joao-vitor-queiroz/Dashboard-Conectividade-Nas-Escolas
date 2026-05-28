# 📶 Dashboard de Conectividade Escolar

Dashboard web para monitoramento da infraestrutura tecnológica de escolas, desenvolvido com HTML, CSS e JavaScript puro.

## 📋 Funcionalidades

- **Resumo geral** com cards mostrando total de escolas, quantas têm internet, quantas não têm, quantas têm laboratório de informática e total de alunos
- **Gráficos** de acesso à internet, laboratório de informática e quantidade de alunos por escola (Chart.js)
- **Listagem** de todas as escolas cadastradas com busca por nome
- **CRUD completo** — cadastrar, editar e excluir escolas
- **Busca de CEP** via API pública ViaCEP para preenchimento automático do endereço

## 🗄️ Estrutura de Dados (Back4App)

Classe: `Escolas`

| Campo | Tipo |
|---|---|
| `nome` | String |
| `qtdAlunos` | Number |
| `internet` | Boolean |
| `laboratorio` | Boolean |
| `cep` | Number |
| `endereco` | String |

## 🔌 APIs utilizadas

- **[Back4App](https://www.back4app.com/)** — banco de dados (Parse REST API) para armazenar e gerenciar os dados das escolas
- **[ViaCEP](https://viacep.com.br/)** — API pública gratuita para buscar endereço a partir do CEP

## 🗂️ Estrutura de Arquivos

```
Dashboard-Conectividade-Nas-Escolas/
├── index.html      # estrutura da página
├── style.css       # estilização
├── app.js          # lógica principal, CRUD e busca de CEP
├── graficos.js     # criação dos gráficos com Chart.js
└── README.md
```

## ▶️ Como executar

> ⚠️ O projeto usa `fetch`, por isso **não funciona abrindo o arquivo direto no navegador** (`file://`). É necessário usar um servidor local.

**Opção 1 — VS Code (recomendado)**

Instale a extensão **Live Server**, clique com o botão direito no `index.html` e selecione **"Open with Live Server"**.

**Opção 2 — Python**

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500` no navegador.

## ⚙️ Configuração do Back4App

No arquivo `app.js`, substitua as variáveis com as chaves do seu projeto:

```js
var APP_ID   = "SEU_APP_ID";
var REST_KEY = "SUA_REST_API_KEY";
```

Essas chaves ficam em: **Back4App → seu app → Settings → Security & Keys**.

## 🛠️ Tecnologias

- HTML, CSS e JavaScript puro
- [Chart.js](https://www.chartjs.org/) — gráficos
- [Back4App](https://www.back4app.com/) — backend (Parse)
- [ViaCEP](https://viacep.com.br/) — API de CEP