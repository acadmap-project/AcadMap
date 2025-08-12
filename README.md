# AcadMap
Esse repositório é dedicado para o desenvolvimento da aplicação proposta pelo professor Sandro Bezerra na disciplina de Laboratório de Engenharia de Software.

## File Structure
A aplicação está sendo desenvolvida sob o padrão de desenvolvimento de software MVC (Module-View-Controller). A estrutura abaixo é a estrutura sugerida para a organização do código gerado, podendo ser alterada e atualizada de acordo com as necessidades encontradas.

```
.
├── .github
│   └── workflows
│       ├── CODEOWNERS
│       ├── ci.yml
│       └── prod-ci.yml
├── .gitignore
├── .idea/
├── CONTRIBUTING.md
├── README.md
├── backend
│   ├── .gitattributes
│   ├── .gitignore
│   ├── .mvn/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── ambiente_dev.sh
│   ├── build_backend_docker.md
│   ├── desinstala_amb.sh
│   ├── docker-volumes
│   │   └── scripts-sql
│   │       ├── 01_init.sql
│   │       ├── 02_insert.sql
│   │       ├── 03_examples.sql
│   │       ├── 04_extra_examples.sql
│   │       └── 05_extra.sql
│   ├── documentacao_ambiente.md
│   ├── endpoint.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── com
│       │   │       └── acadmap
│       │   │           ├── AcadmapApplication.java
│       │   │           ├── controller
│       │   │           │   ├── AreaPesquisaController.java
│       │   │           │   ├── EventoController.java
│       │   │           │   ├── PeriodicoController.java
│       │   │           │   ├── ProgramaController.java
│       │   │           │   ├── UsuarioController.java
│       │   │           │   └── VeiculoController.java
│       │   │           ├── exception/
│       │   │           ├── model/
│       │   │           ├── repository/
│       │   │           └── service/
│       │   └── resources
│       │       └── application.properties
│       └── test
│           └── java
│               └── com
│                   └── acadmap
│                       └── AcadmapApplicationTests.java
├── db
│   └── .gitkeep
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── frontend
│   ├── .eslintrc.json
│   ├── .husky
│   │   └── pre-commit
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── .tool-versions
│   ├── Dockerfile
│   ├── README.md
│   ├── dist/
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── close.svg
│   │   │   ├── drop.svg
│   │   │   └── pfp.svg
│   │   ├── components
│   │   │   ├── AdequacaoDefesa.jsx
│   │   │   ├── CampoEntrada.jsx
│   │   │   ├── CriptografiaSenha.jsx
│   │   │   ├── ErrorPopup.jsx
│   │   │   ├── EventPeriodDropdown.jsx
│   │   │   ├── FiltroEventosPeriodicos.jsx
│   │   │   ├── FormularioCadastro.jsx
│   │   │   ├── FormularioEvento.jsx
│   │   │   ├── FormularioPeriodico.jsx
│   │   │   ├── GerarSenha.jsx
│   │   │   ├── HeaderSistema.jsx
│   │   │   ├── ListaPendentes.jsx
│   │   │   ├── MultipleSelectDropdown.jsx
│   │   │   ├── Popup.jsx
│   │   │   └── SemPermissao.jsx
│   │   ├── hooks
│   │   │   ├── useAreas.js
│   │   │   ├── usePendencias.js
│   │   │   ├── useProgramas.js
│   │   │   └── userAuth.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── CadastroEvento.jsx
│   │   │   ├── CadastroPeriodico.jsx
│   │   │   ├── CadastroUsuario.jsx
│   │   │   ├── ConsultaEventosPeriodicos.jsx
│   │   │   ├── DetalhePendente.jsx
│   │   │   ├── GerenciadorCadastros.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── RegistrosPendentes.jsx
│   │   │   ├── RevisaoCadastroEvento.jsx
│   │   │   ├── ValidacaoPeriodico.jsx
│   │   │   ├── VisualizarEvento.jsx
│   │   │   └── VisualizarPeriodico.jsx
│   │   ├── schemas
│   │   │   ├── CadastrarEventoSchema.ts
│   │   │   ├── CadastrarPeriodicoSchema.ts
│   │   │   └── CadastrarUsuarioSchema.ts
│   │   ├── styles
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   └── utils
│   │       ├── apiUrl.js
│   │       ├── classificacaoBase.js
│   │       ├── format.js
│   │       └── renomearKey.js
│   └── vite.config.js

```

Em casos de dúvidas quanto ao padrão de desenvolvimento MVC, consulte os seguintes links: 
- https://developer.mozilla.org/en-US/docs/Glossary/MVC
- https://www.geeksforgeeks.org/mvc-framework-introduction/

## Convenções e Boas Práticas
Com o objetivo de manter o repositório organizado e bem estruturado, foram definidos alguns hábitos e convenções:
- Conventional Commits:
    - https://www.conventionalcommits.org/en/v1.0.0/
- Git Trunk: 
    - https://www.atlassian.com/br/continuous-delivery/continuous-integration/trunk-based-development
    - https://medium.com/@mateusdecampos/trunk-based-development-1770f5e0dfc1
- Continuos Integration:
    - https://docs.github.com/pt/actions/about-github-actions/about-continuous-integration-with-github-actions
    - https://docs.github.com/pt/actions/about-github-actions/understanding-github-actions
    - https://docs.github.com/pt/enterprise-cloud@latest/actions/use-cases-and-examples/building-and-testing/building-and-testing-java-with-maven
    - https://dev.to/wesleyegberto/github-actions-introducao-com-java-1g4m
    - https://docs.github.com/pt/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs
