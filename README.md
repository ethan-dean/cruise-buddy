# Cruise Connect
### Frontend Dev Setup
1. Pull from GitHub
2. Run "npm install" or "npm ci" for frontend dependencies
3. Create `.env.local` and place clerk key inside

### Backend Dev Setup
1. Pull from GitHub
2. Run "npm install" or "npm ci" for backend dependencies
3. Create `certs/privkey.pem` and place private SSL key inside

# Docker Setup
### Docker Image Registry
1.
### Docker Commands
- `docker build -t [PROJ_NAME] .`
  - Builds image from Dockerfile in current directory (.)
  - **"-t [PROJ_NAME]"** Image is tagged as [PROJ_NAME]
- `docker compose up --build -d`
  - Runs a container of the image (creates container if one does not exist yet)
  - **"--build"** Builds image from Dockerfile in current directory with deafult name 
  - **"-d"** Runs the container in the background, not hanging your command line
- `docker compose up -f compose.yaml -f compose.dev.yaml up`
  - Runs a dev container of the image using specified overrides in compose.dev
  - Opens port 8080 to access server (make sure *[allow insecure localhost](chrome://flags/#allow-insecure-localhost)* is enabled)
    - Connect to https://localhost:8080 with https
- `docker exec -it user_data_db mariadb --user root -p[DB_PASS]`
  - Connect to running database container to query it
- `docker rm $(docker container ls -a -q) && docker rmi $(docker image ls -a -q)`
  - Remove all docker containers and images for fresh restart
- `docker compose down`
  - Gracefully shuts down a container in current directory
- `docker init`
  - Runs CLI that analyzes current directory to setup relevant files
  - Creates **Dockerfile**
    - Contains image build instructions where each instruction is a layer combined to create the final image
  - Creates **compose.yaml**
    - Defines application as a service called server, this is where other dependencies are added (such as database volumes)
  - Creates **.dockerignore**
    - Excludes files and directories from the build context
- `docker run`
  - Used to override the CMD arguments set in the Dockerfile of the image

### Deploying Docker to the cloud

First, build image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

- [Getting Started Building and Pushing](https://docs.docker.com/go/get-started-sharing/)
- [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
- [Docker's Dockerfile guide](https://docs.docker.com/go/dockerfile-reference/)
- [Docker's compose.yaml guide](https://docs.docker.com/go/compose-spec-reference/)
  - [Docker's AwesomeCompose Repo](https://github.com/docker/awesome-compose)
  - [Docker's React/Express/MySQL Repo](https://github.com/docker/awesome-compose/tree/master/react-express-mysql)
- [Docker's .dockerignore guide](https://docs.docker.com/go/build-context-dockerignore/)


### Docker Dev Commands
- `docker compose down; docker rm $(docker container ls -a -q) || echo "No containers to remove"; docker rmi $(docker image ls -a -q) || echo "No images to remove";  docker compose -f compose.yaml -f compose.dev.yaml up -d`
  - Full reset and run of docker container to test backend changes