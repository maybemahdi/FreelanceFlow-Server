# FreelanceFlow - Overview
## A simple Mini CRM for FREELANCERS 

## Setup Instructions  
1. Clone the repository:  
    ```bash  
    git clone https://github.com/maybemahdi/FreelanceFlow-Client 
    ```  
2. Navigate to the project directory:  
    ```bash  
    cd FreelanceFlow-Client 
    ```  
3. Install dependencies:  
    ```bash  
    npm install  
    ```  
4. Configure environment variables:  
    - Create a `.env` file in the root directory.  
    - Add the required variables (e.g., database URL, JWT secret).
    - Example ENV (FRONTEND):
    ```bash  
    VITE_API_URL=http://localhost:5000/api/v1  
    ```
    - Example ENV (SERVER):
    ```bash  
    # DATABASE_URL
    DATABASE_URL=

    PORT=
    BCRYPT_SALT_ROUNDS=
    NODE_ENV=
    
    # NODE_MAILER
    EMAIL=
    PASSWORD=
    
    # JWT
    JWT_ACCESS_SECRET=
    JWT_REFRESH_SECRET=
    JWT_ACCESS_EXPIRES_IN=
    JWT_REFRESH_EXPIRES_IN=
    RESET_PASS_TOKEN=
    RESET_PASS_TOKEN_EXPIRES_IN=
    RESET_PASS_UI_LINK=

    # cloudinary
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=  
    ```
5. Start the development server:  
    ```bash  
    npm run dev  
    ```  

## Tech Stack  
- **Frontend**: React, TypeScript, Redux, Tailwind CSS  
- **Backend**: Node.js, Express, TypeScript 
- **Database**: PostgreSQL  
- **Authentication**: JSON Web Tokens (JWT)  
- **Other Tools**: Prisma ORM, Vite, ESLint, Prettier  

## Entity Relationship Diagram (ERD)
Entity Relationship Diagram Link:  
```bash  
https://drive.google.com/file/d/194CpwcXA_R8Ig9SEDIPTL16wsJKu9Pn_/view?usp=sharing
``` 

Entity Relationship Overview: 
```plaintext  
Users  
  - id (PK)  
  - email  
  - password  

Clients  
  - id (PK)  
  - userId (FK)  
  - name  
  - email  
  - phone  
  - company  
  - notes  

Projects  
  - id (PK)  
  - clientId (FK)  
  - title  
  - budget  
  - deadline  
  - status  

InteractionLogs  
  - id (PK)  
  - clientId (FK)  
  - projectId (FK)  
  - date  
  - interactionType  
  - notes  

Reminders  
  - id (PK)  
  - clientId (FK)  
  - projectId (FK)  
  - dueDate  
  - description  
```  

## Summary of Approach and Decisions  
### Authentication  
- **Decision**: Used JWT for authentication to ensure scalability and statelessness.  
- **Reason**: JWT allows easy integration with frontend and supports secure token-based authentication.  

### Database Design  
- **Decision**: Used PostgreSQL with Prisma ORM for schema management.  
- **Reason**: PostgreSQL provides robust relational database features, and Prisma simplifies schema migrations and queries.  

### Frontend  
- **Decision**: Built with React and TypeScript for type safety and component reusability.  
- **Reason**: TypeScript ensures fewer runtime errors, and React is ideal for building dynamic UIs.  

### Dashboard Visualization  
- **Decision**: Used a combination of table and summary cards for the dashboard.  
- **Reason**: Provides a clear and concise overview of key metrics for freelancers.  

### Best Practices  
- Followed RESTful API design principles.  
- Implemented secure password hashing using bcrypt.  
- Used ESLint and Prettier for consistent code quality.  
- Designed a responsive UI for optimal usability across devices.  
