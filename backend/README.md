# Project Setup and Run Instructions

## Prerequisites

- **Node.js**: Ensure you have Node.js version **22.13** installed.
- **PostgreSQL**: You will need PostgreSQL for the database setup.

---

## Steps to Run the Project

0. **Environment**
   Rename the .env.example to .env
   Replace **username** and **password** with your postgresql username and password.

1. **Install Dependencies**  
   Open a terminal in the project root directory and install the required dependencies:

   ```bash
   npm install
   ```

2. **Config prisma**
   Run the following commad in the terminal to migrate database.

   ```bash
   npx prisma migrate dev
   ```

   Run the following command in the termial to run seeder.

   ```bash
   npm run prisma:seed
   ```

3. **RUN the app**
   CD into project root and RUN the following Command
   ```bash
   npm run start:dev
   ```
   **and that's it. project should be up and running.
   **
   **HAPPY TESTING**
