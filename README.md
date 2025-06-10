# Movie Catalog

Um catálogo de filmes desenvolvido com Laravel e React, permitindo aos usuários gerenciar suas listas de filmes favoritos.

## Requisitos

- PHP 8.1 ou superior
- Composer
- Node.js 16 ou superior
- NPM ou Yarn
- MySQL 8.0 ou superior
- Git

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd movie-catalog
```

2. Instale as dependências:
```bash
composer install
npm install
```

3. Configure o ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados no arquivo .env:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=movie_catalog
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
```

5. Configure a aplicação:
```bash
php artisan key:generate
php artisan migrate --seed
```

6. Compile os assets:
```bash
npm run dev
```

## Executando

1. Inicie o servidor Laravel:
```bash
php artisan serve
```

2. Em outro terminal, inicie o Vite:
```bash
npm run dev
```

3. Acesse: http://localhost:8000

## Credenciais de Teste

- Admin: admin@admin.com / password
- Usuário: user@user.com / password

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de filmes
- Sistema de favoritos
- Interface responsiva
- Dashboard personalizado

## Tecnologias Utilizadas

- Laravel 10
- React
- Inertia.js
- Tailwind CSS
- MySQL
- Vite

## Estrutura do Projeto

```
movie-catalog/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   ├── Layouts/
│   │   └── Pages/
│   └── views/
└── routes/
    └── web.php
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
