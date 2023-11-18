
## Welcome to V-Scope

- A Capstone Project

## Project Details

```bash

# Open VSCode Terminal

# then go to projects directory
cd your-app-name

# then to install all dependencies
npm install

# then to start the server
npm run dev

# then to open "http://localhost:3000"

```

Local Server : [http://localhost:3000](http://localhost:3000) 

## How To Use

1. Download GitHub file, paste in any directory.
2. Download Node.Js (need restart after instalation).
3. open the downloaded GitHub file in VScode.
3. create new file named ".env" paste env text inside.
4. open Terminal then run "npm install".
5. Download MongoDB
6. Click Connect
7. Add database named "vscope" with collection named "accounts"
8. In mongoDB click "vscope" then "accounts" then "ADD DATA" then "Insert Document"
9. Paste the Collection depending on departments admin and managments

```bash
# ROLE = ["Client","Management", "Admin"]
# DEPARTMENT = ["Dental","Medical", "SDPC", null] 
# null = user
# ONLY editable fields GoogleEmail, Role, Department. 

{
  "GoogleId": "0",
  "GoogleEmail": "email@email.com",
  "GoogleImage": "-",
  "GoogleName": "-",
  "GoogleFirstname": "-",
  "GoogleLastname": "-",
  "Role": "Admin",
  "Department": "Medical",      
  "createdAt": {
    "$date": "2023-11-06T11:48:03.244Z"
  },
  "updatedAt": {
    "$date": "2023-11-06T11:48:03.244Z"
  },
  "__v": 0
}

```