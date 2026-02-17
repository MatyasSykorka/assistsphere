# AssistSphere
AssistSphere is a open-source content management helpdesk built for efficiency and scalability. It leverages a modern tech stack to provide a robust solution for managing customer support and documentation.

##### The application architecture includes:
- Next.js and it's libraries
- PostgreSQL for database
- Bun - TS/JS toolkit


# How to run it? 
## 1. Requrements
#### You must have installed:
- [Git](https://git-scm.com/install/windows)
- [Bun](https://bun.com)
- [Docker Engine / Docker Desktop](https://www.docker.com)


## 2. App installation
### Clone this repository
Run:
<html><head><code>git clone https://github.com/MatyasSykorka/assistsphere.git</code>

### Create enviroment for AssistSphere
Duplicate **env.example** and rename it to **.env** and fill it with your data. You need to edit POSTGRES_PASSWORD and DATABASE_URL variables and replace "*<change_me>*" text. Than you need to create the secret keys that the app needs.

### Generate key for AUTH_SECRET variable
Run:
<html><head><code>bunx auth secret</code>

This will create a **.env.local** file. Copy the key from it and replace "*<generate_with_bunx_auth_secret>*" in **.env**. Then you need to delete .env.local.


### Generate/get API key for BETTER_AUTH_SECRET variable
And last key you need to get is Better Auth API key. First you need to visit [Better-auth](https://www.better-auth.com/docs/installation) website and find button **Generate Secret** (Recommended) or type in Bash/Git Bash <html><head><code>openssl rand -base64 32</code>. Copy that and replace "*<create_in_better_auth_dashboard>*" in BETTER_AUTH_SECRET variable.

### Deployment with Docker 
In assistsphere folder execute the following command in your terminal:

<html><head><code>docker compose -f ./docker/docker-compose.yml up -d</code>

##### For Windows, if you run it in Docker Desktop you need to do:
Install Windows Subsystem for Linux (WSL). Then open Docker Desktop and run the same command to deploy application in the assistphere folder.

### Default admin information
You need to edit .env file you created and uncomment variables under *Seed (optional)*.