# Project Setup and Run Instructions

## Prerequisites

- **Node.js**: Ensure you have Node.js version **22.13** installed.
- **PostgreSQL**: You will need PostgreSQL for the database setup.

---

## Steps to Run the Project

0. **Environment**
   Rename the .env.example to .env

1. **Install Dependencies**  
   Open a terminal in the project root directory and install the required dependencies:

   ```bash
   npm install

   ```

2. **Config prisma**
   Run **npx prisma migrate dev** in the terminal to migrate database.
   Run **npm run prisma:seed** in the termial to run seeder.

3. **RUN the app**
   CD into project root and RUN **npm run start:dev** Command and that's it. project should be up and running.

**HAPPY TESTING**
