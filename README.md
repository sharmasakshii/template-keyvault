# 🌍 Greensight_Backend

## 📌 General Information

* **Framework**: Express.js
* **Language**: TypeScript
* **Database**: Microsoft SQL Server (MSSQL)
* **ORM**: Sequelize
* **Authentication**: JWT / OAuth with cookies
* **Testing**: Jest
* **Node.js Version**: `20.15.0`

---

## 🚀 Features

* RESTful API design with Express & TypeScript
* **Authentication & Authorization** using JWT/OAuth with cookies
* MSSQL database integration with Sequelize ORM
* Centralized error handling & validation
* Unit and integration testing with Jest
* Secure environment variable management
* Scalable project structure for enterprise readiness

---

## 📂 Project Structure

```
greensight-backend/
│-- src/
│   │-- controllers/     # API request handlers
│   │-- routes/          # Route definitions
│   │-- models/          # Sequelize models
│   │-- middlewares/     # Auth & error middlewares
│   │-- services/        # Business logic layer
│   │-- utils/           # Helper functions
│   └-- app.ts           # App entry point
│
│-- tests/               # Jest test cases
│-- .env.example         # Example environment variables
│-- package.json
│-- tsconfig.json
│-- README.md
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Scope23-GreenSight/greensight_backend_ca.git
   cd greensight_backend_ca
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   * Copy `.env.example` to `.env`
   * Update values for:

     * Database connection (MSSQL)
     * JWT secret key
     * OAuth client details
     * Cookie/session settings


4. **Start the server**

   ```bash
   npm run dev   # Development mode
   npm start     # build
   ```

---

## 🧪 Testing

* Test framework: **Jest**
* Location: `tests/` directory

Run tests:

```bash
npm test
```

Generate coverage:

```bash
npm run test:coverage
```

---


## 👨‍💻 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/GD-ticket-number`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push branch (`git push origin feature/GD-ticket-number`)
5. Open a Pull Request

---

## 📞 Contact

* **Environment Variables**: Vikrant
* **Access-related Concerns**: Singh Paramveer
* **Repository Owner**: Singh Paramveer
