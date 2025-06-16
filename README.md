# AcadMap
Esse repositório é dedicado para o desenvolvimento da aplicação proposta pelo professor Sandro Bezerra na disciplina de Laboratório de Engenharia de Software.

## File Structure
A aplicação está sendo desenvolvida sob o padrão de desenvolvimento de software MVC (Module-View-Controller). A estrutura abaixo é a estrutura sugerida para a organização do código gerado, podendo ser alterada e atualizada de acordo com as necessidades encontradas.

```
.
├── backend
│   ├── Dockerfile
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com
│   │       │       └── acadmap
│   │       │           ├── controller
│   │       │           ├── model
│   │       │           ├── repository
│   │       │           └── service
│   │       └── resources
│   └── tomcat
├── db
├── docker-compose.yml
├── .env
├── frontend
│   ├── Dockerfile
│   ├── public
│   └── .husky
│       └── pre-commit
│   └── src
│       ├── assets
│       ├── components 
│       ├── pages 
│       ├── hooks 
│       ├── utils 
│       ├── styles 
│       │   ├── App.css
│       │   └── index.css
│       ├── App.jsx
│       └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── .eslintignore
│   ├── .prettierignore
│   └── README.md
├── .github
│   └── workflows
│       └── ci.yml
└── README.md

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
