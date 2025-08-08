
# 📘 API - Veículo de Publicação

Este documento descreve os endpoints disponíveis no backend, incluindo os métodos HTTP esperados, headers e parâmetros de entrada.

Base URL:  
```
/api/veiculo
```

---

## ✅ 1. **Aprovar Veículo de Publicação**

**Endpoint:**
```
PUT /api/veiculo/aprovar-veiculo/{id}
```

**Descrição:**  
Aprova um veículo de publicação caso o usuário **não seja um pesquisador** e **não esteja vinculado** ao veículo.

**Headers obrigatórios:**
```http
X-User-Id: <UUID do usuário que está tentando aprovar>
```

**Path Parameters:**
- `id` – UUID do veículo a ser aprovado

**Corpo esperado:**
```json
{
  "flagPredatorio": true
}
```

**Resposta:**
- `202 Accepted` – Veículo aprovado com sucesso
- `405 Method Not Allowed` – Usuário sem permissão para aprovar
- `400 Bad Request` – Erro na requisição (ex: veículo inexistente)

---

## ❌ 2. **Negar Veículo de Publicação**

**Endpoint:**
```
PUT /api/veiculo/negar-veiculo/{id}
```

**Descrição:**  
Nega um veículo de publicação, sob as mesmas regras de aprovação.

**Headers obrigatórios:**
```http
X-User-Id: <UUID do usuário que está tentando negar>
```

**Path Parameters:**
- `id` – UUID do veículo a ser negado

**Corpo esperado:**
```json
{
  "flagPredatorio": true,
  "justificativa": "Texto"
}
```

**Resposta:**
- `202 Accepted` – Veículo negado com sucesso
- `405 Method Not Allowed` – Usuário sem permissão para negar
- `400 Bad Request` – Erro na requisição

---

## 📄 3. **Listar Veículos Pendentes**

**Endpoint:**
```
GET /api/veiculo/periodico-pendente
```

**Descrição:**  
Retorna todos os veículos de publicação com status **pendente**.

**Headers obrigatórios:**
```http
X-User-Id: <UUID do usuário solicitante>
```

**Resposta:**
- `200 OK` – Lista de veículos pendentes
- Resposta de exemplo:
```json
[
  {
    "idVeiculo": "66666666-6666-6666-6666-666666666666",
    "nome": "International Conference on Algorithms",
    "classificacao": "a2",
    "vinculoSbc": "vinculo_comum",
    "adequadoDefesa": "mestrado_doutorado",
    "tipo": "evento",
    "status": "pendente",
    "usuario": {
      "idUsuario": "22222222-2222-2222-2222-222222222222",
      "nome": "Dr. Alan Turing",
      "email": "alan.turing@email.com",
      "tipoPerfil": "pesquisador",
      "idPrograma": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "idsAreasPesquisa": [
        "a111a111-b222-c333-d444-e555e555e555"
      ]
    },
    "areasPesquisa": [
      {
        "id": "a111a111-b222-c333-d444-e555e555e555",
        "nome": "Ciência da Computação"
      }
    ],
    "linkEvento": "http://localhost:5173/cadastro-evento"
  }
]
```
- `404 Not Found` – Nenhum veículo pendente encontrado

---

## ⚙️ Regras internas de negócio

- **Permissões de ação** (aprovar/negar) são negadas se o usuário:
  - Tem perfil de **pesquisador**
  - Está **vinculado** ao veículo (`id_usuario` do veículo = `X-User-Id`).


# 📘 API - Cadastro de usuário

**Endpoint:** `POST /api/usuario/cadastro`  
**Descrição:** Cria um novo usuário no sistema.

---

## 🔸 Requisição

**Content-Type:** `application/json`  
**Corpo esperado:**

```json
{
  "nome": "Maria da Silva",
  "email": "maria.silva@example.com",
  "senha": "senha123",
  "tipoPerfil": "PESQUISADOR",
  "idPrograma": "c6f2e2de-ef91-4f3f-9e43-2f95f8dd4a21",
  "idsAreasPesquisa": [
    "a1b2c3d4-e5f6-7890-ab12-34567890cdef",
    "123e4567-e89b-12d3-a456-426614174000"
  ]
}
```

### Campos:
- `nome` (string): Nome completo do usuário.
- `email` (string): E-mail do usuário.
- `senha` (string): Senha para acesso.
- `tipoPerfil` (string): Tipo do perfil do usuário. Ex: `"PESQUISADOR"`, `"ADMIN"`, etc.
- `idPrograma` (UUID): Identificador do programa vinculado.
- `idsAreasPesquisa` (array de UUIDs): IDs das áreas de pesquisa associadas ao usuário.

---

## ✅ Resposta

**Status:** `201 Created`  
**Body:**

```json
{
  "idUsuario": "c8f6df88-9227-42e4-bd0a-36f8f9e7e021",
  "nome": "Maria da Silva",
  "email": "maria.silva@example.com",
  "tipoPerfil": "PESQUISADOR",
  "idPrograma": "c6f2e2de-ef91-4f3f-9e43-2f95f8dd4a21",
  "idsAreasPesquisa": [
    "a1b2c3d4-e5f6-7890-ab12-34567890cdef",
    "123e4567-e89b-12d3-a456-426614174000"
  ]
}
```

### Campos:
- `idUsuario` (UUID): Identificador único do usuário criado.
- `nome`, `email`, `tipoPerfil`, `idPrograma`, `idsAreasPesquisa`: mesmos campos enviados, com confirmação do que foi salvo.

---

# 📘 API - Evento

Base URL:

```
/api/eventos
```

## ➕ 1. **Cadastrar Evento**

**Endpoint:**

```
POST /api/eventos
```

**Descrição:**  
Cria um novo evento no sistema, _deve ser um usuario já cadastrado no sistema_.

**Headers obrigatórios:**

```http
X-User-Id: <UUID do usuário que está tentando aprovar>
```

**Path Parameters:**

- `id` – UUID do usuário que está tentando inserir o evento.

**Resposta:**

- `202 Accepted` – Evento criado com sucesso.
- `409 Conflit` – Tentativa de cadastrar um evento ja cadastrado, duplicação de evento.
- `400 Bad Request` – Erro na requisição.

---

## 🔸 Requisição

**Corpo esperado:**

```json
{
  "nome": "Congresso Nacional de Tecnologia",
  "vinculoSbc": "sem_vinculo",
  "areasPesquisaIds": [
    "c3398a61-b985-42af-9fe5-d6bddd971a87",
    "a3c5f2a4-081a-4a17-8c8b-9a60c431c931"
  ],
  "h5": 42,
  "linkEvento": "https://congresso-tecnologia.org",
  "linkGoogleScholar": "https://scholar.google.com/congresso-tecnologia",
  "linkSolSbc": "https://sol.sbc.org.br/congresso-tecnologia"
}
```

### Campos:

- `nome` (string): Nome do evento.
- `vinculoSbc` (string): Tipo de vinculo com a sbc (Enum = "sem_vinculo", "vinculo_top_10", "vinculo_top_20", "vinculo_comum" ).
- `areasPesquisaIds`(array de UUIDs): IDs das áreas de pesquisa associadas ao evento.
- `h5` (integer): Índice H5 do evento.
- `linkEvento` (string): Link do evento o qual está sendo inserido.
- `linkGoogleScholar` (string) : Link do googlescholar referente ao evento o qual está sendo inserido
- `linkSolSbc` (string) : Link repositório SOL-SBC referente ao evento o qual está sendo inserido.

---

## ✅ Resposta

**Status:** `201 Created`  
**Body:**

```json
{
  "idVeiculo": "1077ced6-3f23-444d-b341-4750cf2bd1e8",
  "nome": "Congresso Nacional de Tecnologia",
  "classificacao": "a1",
  "vinculoSbc": "sem_vinculo",
  "adequadoDefesa": "nenhum",
  "tipo": "evento",
  "status": "pendente",
  "h5": 42,
  "linkEvento": "https://congresso-tecnologia.org",
  "linkGoogleScholar": "https://scholar.google.com/congresso-tecnologia",
  "linkSolSbc": "https://sol.sbc.org.br/congresso-tecnologia",
  "areasPesquisaIds": [
    "a3c5f2a4-081a-4a17-8c8b-9a60c431c931",
    "c3398a61-b985-42af-9fe5-d6bddd971a87"
  ],
  "usuario": {
    "idUsuario": "11111111-aaaa-bbbb-cccc-000000000027",
    "nome": "Isabela Neves"
  }
}
```

### Campos:

- `idVeiculo` (UUID): Identificador único do evento criado.
- `nome` , `vinculoSbc`: Mesmos campos enviados, com confirmação do que foi salvo.
- `classificacao`, `adequacaoDefesa` : a8, nenhum como padrão, no entanto ainda será modificado atraves de calculos. Será implementado a partir de outras RFS.
- `tipo`, `status` : Valores padrões na criação de Evento. (Evento, Pendente)
- `h5`, `linkEvento`, `linkGoogleScholar`, `linkSolSbc` , `areaPesquisaIds`: Mesmos campos enviados, com confirmação do que foi salvo.
- `usuario` : Informação de Id e Nome do usuário o qual inseriu Evento.

### Forçar inserção mesmo com erro de duplicação :

```
POST /api/eventos?forcar=true
```

---
## 📋 2. **Detalhar evento por ID**

**Endpoint:**

```
GET /api/eventos/{id}
```
**Descrição:**  
Retorna os detalhes do evento solicitado via ID.

---

### ✅ **Exemplo de uso**
```
GET /api/eventos/4e8f5b70-92f3-4c21-b07b-6a5d5c6f901a
```
---

### ✅ **Resposta de Sucesso (200 OK)**
```json
{
    "nome": "Symposium on Distributed Computing",
    "h5": 50,
    "classificacao": "a2",
    "areasPesquisas": [
        "Ciência da Computação",
        "Engenharia Elétrica"
    ],
    "vinculoSbc": "vinculo_top_10",
    "linkGoogleScholar": "http://scholar.google.com/sdc",
    "linkSolSbc": "https://sol-sbc/sdc",
    "adequacaoDefesa": "doutorado"
}
```

---

### ❌ **Possíveis Erros**

#### **1. Evento não encontrado**  
Status: `404 NOT FOUND`  
**Resposta:**
```json
{
    "path": "/api/eventos/66666666-6666-6666-6666-666666666661",
    "error": "EVENTO_NAO_ENCONTRADO",
    "timestamp": "2025-07-17T21:30:44.281158971",
    "status": 404
}
```
---

#### **2. Evento não aceito**
**Status:** `400 BAD REQUEST`  
**Resposta:**
```json
{
    "path": "/api/eventos/66666666-6666-6666-6666-666666666666",
    "error": "NAO_ACEITO",
    "timestamp": "2025-07-17T21:31:39.378190018",
    "status": 400
}
```

---

### ✅ **Códigos de resposta**
| Código | Descrição                                 |
|--------|-------------------------------------------|
| 200    | Detalhes do evento retornados com sucesso |
| 400    | Evento existe, mas não está aceito        |
| 404    | Evento não encontrado                     |

---
# 📋 3. Listar e Filtrar Eventos Aprovados
**Endpoint:**

```
POST /api/eventos/listar
```

**Descrição:**

Retorna uma lista resumida de todos os eventos com status 'aceito', com base num conjunto complexo de filtros enviados no corpo da requisição. Se um corpo vazio ou nulo for enviado, retorna todos os veículos aprovados. Este endpoint substitui o antigo GET /listar.

---
### 🔸 Requisição

**Content-Type:** application/json

Corpo (Body) esperado:
```
O corpo da requisição é um objeto JSON onde todos os campos são opcionais.
```
Exemplo de Corpo (Body):

```
JSON

{
"nome": "Conference",
"areasPesquisaNomes": ["Ciência da Computação", "Engenharia Elétrica"],
"vinculoSbc": true,
"adequacaoDefesa": ["MESTRADO", "DOUTORADO"],
"h5Minimo": 50,
"classificacaoMinima": "a2",
"correspondenciaExata": false
}

```
Campos do Filtro:

- ``nome (string)``: Filtra veículos cujo nome contenha o texto informado.
- ``areasPesquisaNomes (array de strings)``: Retorna veículos que pertençam a pelo menos uma das áreas de pesquisa listadas.
- ``vinculoSbc (boolean)``:
  - ``true``: Retorna apenas veículos que possuem algum vínculo com a SBC.
  - ``false``: Retorna apenas veículos sem vínculo com a SBC.
- ``adequacaoDefesa (array de strings)``: Retorna veículos adequados para as defesas listadas. Valores possíveis no Enum: "MESTRADO", "DOUTORADO", "MESTRADO_DOUTORADO", "NENHUM".
- ``h5Minimo (integer)``: Retorna veículos com índice H5 igual ou superior ao valor especificado.
- ``classificacaoMinima (string)``: Retorna veículos com classificação igual ou superior à especificada. A ordem é: a8 (mais baixa) até a1 (mais alta). Valores possíveis: "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8".
- ``correspondenciaExata (boolean)``: Define como os filtros são combinados.
  - ``false (padrão)``: Lógica OR (inclusiva). Retorna veículos que correspondam a qualquer um dos filtros preenchidos.
  - ``true``: Lógica AND (excludente). Retorna veículos que correspondam a todos os filtros preenchidos.

### ✅ **Códigos de resposta**

| Código | Descrição                                    |
|--------|----------------------------------------------|
| 200    | Lista de periódicos retornada com sucesso.   |
| 500    | Erro interno no servidor.                    |
Nota para Desenvolvedores: O antigo endpoint GET /listar?nome=... foi marcado como obsoleto (@Deprecated) no backend. Ele continua a funcionar por retrocompatibilidade, mas todo o novo desenvolvimento deve usar o endpoint POST /listar com o corpo JSON.

---

# 📘 API - Periodico

Base URL:

```
/api/periodicos
```

---

## ➕ 1. **Cadastrar Periodico**

**Endpoint:**

```
POST /api/periodicos
```

**Descrição:**  
Cria um novo periódico no sistema, _deve ser um usuario já cadastrado no sistema_.

**Headers obrigatórios:**

```http
X-User-Id: <UUID do usuário que está tentando aprovar>
```

**Path Parameters:**

- `id` – UUID do usuário que está tentando inserir o evento.

**Resposta:**

- `202 Accepted` – Evento criado com sucesso.
- `409 Conflit` – Tentativa de cadastrar um evento ja cadastrado, duplicação de evento.
- `400 Bad Request` – Erro na requisição.

---

## 🔸 Requisição

**Corpo esperado:**

```json
{
  "nome": "Journal of Academic Studies2",
  "vinculoSBC": "sem_vinculo",
  "issn": "12345698",
  "percentilJcr": 75,
  "percentilScopus": 80,
  "linkJcr": "https://jcr.example.com/journal123",
  "linkScopus": "https://scopus.example.com/journal123",
  "classificacao": "A1",
  "areasPesquisaIds": [
    "a111a111-b222-c333-d444-e555e555e555",
    "b222b222-c333-d444-e555-f666f666f666"
  ]
}
```

### Campos:

- `nome` (string): Nome do evento.
- `vinculoSbc` (string): Tipo de vinculo com a sbc (Enum = "sem_vinculo", "vinculo_top_10", "vinculo_top_20", "vinculo_comum" ).
- `issn` (string): Número Internacional Normalizado para Publicações Seriadas, limitado a 8 números. Deve ser único em cada cadastro, acusa duplicação.
- `percentilJcr` (Integer): Valor numérico.
- `percentilScopus` (Integer): Valor numérico.
- `linkJrc` (string) : Link do Jrc referente ao periódico o qual está sendo inserido
- `linkScopus` (string) : Link repositório Scopus referente ao periodico o qual está sendo inserido.
- `classificacao` (string) : Classificação do veículo (Enum = "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8")
- `linkGoogleScholar` (string) : Link do googlescholar referente ao periódico o qual está sendo inserido
- `qualisAntigo` (string) : Pontuação do Qualis antigo (Enum= "a1", "a2", "b1", "b2", "b3", "b4", "b5', "c").
- `areasPesquisaIds`(array de UUIDs): IDs das áreas de pesquisa associadas ao evento.

---

## ✅ Resposta

**Status:** `201 Created`  
**Body:**

```json
{
  "idVeiculo": "ce700504-ea1c-4653-aeaa-972f9866a34c",
  "nome": "Journal of Academic Studies2",
  "classificacao": "a1",
  "vinculoSBC": "sem_vinculo",
  "adequadoDefesa": "nenhum",
  "tipo": "periodico",
  "status": "pendente",
  "issn": "12345698",
  "percentil_jcr": 75,
  "percentil_scopus": 80,
  "linkJcr": "https://jcr.example.com/journal123",
  "linkScopus": "https://scopus.example.com/journal123",
  "linkGoogleScholar": null,
  "qualisAntigo": null,
  "areasPesquisaIds": [
    "a111a111-b222-c333-d444-e555e555e555",
    "b222b222-c333-d444-e555-f666f666f666"
  ],
  "usuario": {
    "idUsuario": "00000000-0000-0000-0000-000000000001",
    "nome": "Admin Mestre"
  }
}
```

### Campos:

- `idVeiculo` (UUID): Identificador único do evento criado.
- `nome` , `vinculoSbc`: Mesmos campos enviados, com confirmação do que foi salvo.
- `adequacaoDefesa` : a8, nenhum como padrão, no entanto ainda será modificado atraves de calculos. Será implementado a partir de outras RFS.
- `tipo`, `status` : Valores padrões na criação de Evento. (Periodico, Pendente)
- `issn`, `classificacao`, `percentilJcr`, `percentilScopus`, `linkJrc`, `linkScopus` , `linkGoogleScholar`, `qualisAntigo`, `areasPesquisaIds`: Mesmos campos enviados, com confirmação do que foi salvo.
- `usuario` : Informação de Id e Nome do usuário o qual inseriu Evento.

### Forçar inserção mesmo com erro de duplicação :

```
POST /api/periodicos?forcar=true
```

---
 ## 📋 2. **Detalhar periódico por ID**

**Endpoint:**

```
GET /api/periodicos/{id}
```

**Descrição:**  
Retorna os detalhes do periódico solicitado via ID.

---

### ✅ **Exemplo de uso**
```
GET /api/periodicos/4e8f5b70-92f3-4c21-b07b-6a5d5c6f901a
```

---

### ✅ **Resposta de Sucesso (200 OK)**
```json
{
  "nome": "IEEE Transactions on Information Theory",
  "issn": "99887766",
  "percentilJcr": null,
  "percentilScopus": null,
  "areasPesquisas": [
    "Ciência da Computação",
    "Engenharia Elétrica"
  ],
  "vinculoSbc": "vinculo_top_10",
  "linkJcr": null,
  "linkScopus": null,
  "linkGoogleScholar": "http://scholar.google.com",
  "qualisAntigo": "a1",
  "classificacao": "a1",
  "flagPredatorio": false,
  "adequacaoDefesa": "doutorado"
}
```

---

### ❌ **Possíveis Erros**

#### **1. Periódico não encontrado**  
Status: `404 NOT FOUND`  
**Resposta:**
```json
{
  "path": "/api/periodicos/11111111-1111-1111-1111-111111111105",
  "error": "PERIODICO_NAO_ENCONTRADO",
  "timestamp": "2025-07-17T22:47:49.740520044",
  "status": 404
}
```
---

#### **2. Periódico não aceito**
Status: `400 BAD REQUEST`  
**Resposta:**
```json
{
  "path": "/api/periodicos/88888888-cccc-cccc-cccc-cccccccccccc",
  "error": "NAO_ACEITO",
  "timestamp": "2025-07-17T22:48:44.87700495",
  "status": 400
}
```

---

### ✅ **Códigos de resposta**
| Código | Descrição                                    |
|--------|----------------------------------------------|
| 200    | Detalhes do periódico retornados com sucesso |
| 400    | Periódico existe, mas não está aceito        |
| 404    | Periódico não encontrado                     |

---
# 📋 3. Listar e Filtrar Periódicos Aprovados
**Endpoint:**

```
POST /api/periodicos/listar
```

**Descrição:** 

Retorna uma lista resumida de todos os periódicos com status 'aceito', com base num conjunto complexo de filtros enviados no corpo da requisição. Se um corpo vazio ou nulo for enviado, retorna todos os veículos aprovados. Este endpoint substitui o antigo GET /listar.

---
## 🔸 Requisição

**Content-Type:** application/json

Corpo (Body) esperado:
```
O corpo da requisição é um objeto JSON onde todos os campos são opcionais.
```
Exemplo de Corpo (Body):

```
JSON

{
"nome": "Conference",
"areasPesquisaNomes": ["Ciência da Computação", "Engenharia Elétrica"],
"vinculoSbc": true,
"adequacaoDefesa": ["MESTRADO", "DOUTORADO"],
"h5Minimo": 50,
"classificacaoMinima": "a2",
"correspondenciaExata": false
}

```
Campos do Filtro:

- ``nome (string)``: Filtra veículos cujo nome contenha o texto informado.
- ``areasPesquisaNomes (array de strings)``: Retorna veículos que pertençam a pelo menos uma das áreas de pesquisa listadas.
- ``vinculoSbc (boolean)``:
  - ``true``: Retorna apenas veículos que possuem algum vínculo com a SBC.
  - ``false``: Retorna apenas veículos sem vínculo com a SBC.
- ``adequacaoDefesa (array de strings)``: Retorna veículos adequados para as defesas listadas. Valores possíveis no Enum: "MESTRADO", "DOUTORADO", "MESTRADO_DOUTORADO", "NENHUM".
- ``h5Minimo (integer)``: Retorna veículos com índice H5 igual ou superior ao valor especificado.
- ``classificacaoMinima (string)``: Retorna veículos com classificação igual ou superior à especificada. A ordem é: a8 (mais baixa) até a1 (mais alta). Valores possíveis: "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8".
- ``correspondenciaExata (boolean)``: Define como os filtros são combinados.
  - ``false (padrão)``: Lógica OR (inclusiva). Retorna veículos que correspondam a qualquer um dos filtros preenchidos.
  - ``true``: Lógica AND (excludente). Retorna veículos que correspondam a todos os filtros preenchidos.

### ✅ **Códigos de resposta**

| Código | Descrição                                    |
|--------|----------------------------------------------|
| 200    | Lista de periódicos retornada com sucesso.   |
| 500    | Erro interno no servidor.                    |
Nota para Desenvolvedores: O antigo endpoint GET /listar?nome=... foi marcado como obsoleto (@Deprecated) no backend. Ele continua a funcionar por retrocompatibilidade, mas todo o novo desenvolvimento deve usar o endpoint POST /listar com o corpo JSON.