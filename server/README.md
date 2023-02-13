# Book API

To start the project, create an `.env` file at the root of the project. If you are using Docker, use the following configurations.

```bash
SERVER_HOST=127.0.0.1
SERVER_PORT=3004
MONGODB_URI=mongodb://mongodb:27017/book
API_VERSION=1.0.0
FIREBASE_ADMIN_CREDENTIALS= //get from firebase.example
FIREBASE_CLIENT_CREDENTIALS= //get from firebase.example
```

If you directly using your working machine ( Require Node v14) and MongoDB installed on your machine please update

```bash
MONGODB_URL=mongodb://localhost:27017/book
```

You can start the project using the following command

```bash
npm start:dev
```

or just spin the Docker containers:

```bash
docker-compose up --build -d
```

If you are using MacOs, pleae run `npm install` outside the docker with node v14 before run above command

Link swagger:

```
http://localhost:3004/docs/book
```
