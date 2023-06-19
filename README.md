
# Back-end NestJS Documentation

## Debugging
1. Run
```bash
npm run start:debug
```
2. Click on the debugger icon: (The one with play button and a small bug)
3. Select ```Create a launch.json file``` then choose nodejs
4. Click on ```Add Configuration```
5. Delete this
```json
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "program": "${file}",
    "outFiles": [
        "${workspaceFolder}/**/*.js"
    ]
}
```
6. Put a breakpoint in your code and start the debugger by clicking ```Attach```
## Project initialize
### 1. Init a project
``` bash
nest new server
```
- Select a corresponding package manager for project.

### 2. Change directory into server
``` bash
cd server
```

### 3. Clean up init project
- Open ```app.service.ts``` and delete this
```typescript
@Get()
getHello(): string {
return 'Hello World!';
}
```

- Open ```app.controller.ts``` and delete this
```typescript
@Get()
getHello(): string {
return this.appService.getHello();
}
```
## Setup database
### 1. Install database
### Using GUI
1. Install posgres on local machine
2. Install pgAdmin4 or DBeaver
3. Create database named crabDB
### Using CLI
1. Open up the terminal and type 
    ``` bash
    sudo -i -u postgres
    ```
2. After that, enter
    ``` bash
    psql
    ```
3. You can list your database by typing ```\l```
4. Create a new database named **crabDB**
    ```bash
    createdb crabDB
    ```
5. You can connect to your database by typing
    ```bash
    \c "crabDB"
    ```

## Installing prisma for ORM
1.  Make sure you are in the server folder ```../crab-server/server```
```bash
npm install prisma
```
2. After that, we have to init prisma, type in:
```
npx prisma init
```
- This will create a .env file for us to put in our database config and a folder named ```prisma```
- If you don't have highlighting for prisma, head into vscode and install prisma extension    
3. Next, we need to config our database credentials in `.env`
   - Empty the file first the copy the following.
   - Make sure to change your DB_NAME, DB_USER and DB_PASSWORD correspondingly
    ```
    HOST = localhost
    PORT = 5432
    DB_NAME=crabDB
    DB_USERNAME=your_db_name_hear
    DB_PASSWORD=your_password_here
    DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${HOST}:${PORT}/${DB_NAME}
    ```
4. That's enough to setup database, to visualize our data, prisma have a cool tool named prisma studio, we can use it:
    ```
    npx prisma studio
    ```

## Creating models for our database
1. Head to our schema.prisma file and start creating model
   - https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
   - https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-models
2. Define our models in the file schema.prisma
3. After that, we can execute the command:
```bash
npx prisma db push
```
4. After creating our database, we can head to DBeaver to check our ER
5. Run this command to open up prisma studio
```bash
npx prisma studio 
```