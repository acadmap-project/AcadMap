
# 📘 API - Veículo de Publicação

Este documento descreve os endpoints disponíveis no controlador `VeiculoController`, incluindo os métodos HTTP esperados, headers e parâmetros de entrada.

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
- `404 Not Found` – Nenhum veículo pendente encontrado

---

## ⚙️ Regras internas de negócio

- **Permissões de ação** (aprovar/negar) são negadas se o usuário:
  - Tem perfil de **pesquisador**; ou
  - Está **vinculado** ao veículo (`id_usuario` do veículo = `X-User-Id`).

