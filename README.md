
# Social Media API

A social media APIs implemented with (Node.js, Express.js)




## Follow Me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin&labelColor=blue)](https://www.linkedin.com/in/mohamed-aref-850b78284/)
 [![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github&labelColor=black)](https://github.com/MohmedAref31)





## Table of content
- [Installation](#Installation)
- [Usage](#Usage)
- [Tech Stack](#Tech-Stack)
- [Features](#Features)
- [Documentation](#Documentation)

## Installation

```Note
    You must have redis installed on your machine or use redis cloud
```
**[Redis](https://redis.io)**

1-Clone the repo 

```bash
git clone https://github.com/MohmedAref31/social-media-api
cd social-media-api
```
2-Install dependencies

```bash
  npm install
```
3- Setup environment variables
```env
DB_URI = your database url

PORT = your port ex(5000)

MODE = dev / prod

BASE_URL = your base url ex (http://localhost:5000)

GOOGLE_CLIENT_ID = your google client id for passport google auth

GOOGLE_CLIENT_SECRET = your google client secret

BREVO_API_KEY = your brevo api key for sending emails

REDIS_URL = your redis url ex(redis://127.0.0.1:6379)
```
## Usage

**You must have redis installed on your machine**

```bash
npm run dev
```


## Tech Stack
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB and Node.js.
- **Passport.js**: Authentication middleware for Node.js.
- **Socket.io**: Library for real-time web applications.
- **Multer**: Middleware for handling multipart/form-data,   primarily used for file uploads.
- **Express Validator**: Middleware for server-side validation.
- **Express Session**: Session middleware for Express.
- **Compression**: Middleware to compress response bodies.
- **Dotenv**: Module to load environment variables from a .env file.
- **CORS**: Middleware to enable CORS.
- **Bcrypt**: Library to hash passwords.
- **Redis**: In-memory data structure store, used as a database, cache, and message broker.
- **Brevo API (sib-api-v3-sdk)**: Node.js client for Brevo’s API.


## Features

- **User Management** 
    - user can register new account or use  his google account
    - user can login 
    - user can update his (personal infos, email, profile image, password)
    - user can reset his password in case of forgotten 
- **Post Management**
    - user can (create, update, delete) his his own post
    - user can like/unlike post 
    - user can get post feed based on his friends posts and heighest rech posts 
- **Status Management**
    - user can (create, delete) his own Status
    - user can like/unlike status 
    - user can get his friends statuses
- **Comment Management**
    - user can (add, delete, update) comment on status or post
    - user can toggle like on a comment 
    - user can reply on a comment  
    - user can get comments on specific post or on his own status
    - user can get comment replies

- **Friend Request Management**
    - users can send friend requests to each other
    - users can accept or cancel thier friend requests
    - users can get thier frien requests
- **Chat Management** 
    - real time messagging
    - users can send messages to each other
    - users can update thier messages or delete them 
    - users can get all previous messages or chats 
- **Search**
    - users can search for posts or other users
- **Real-Time Notifications**
    - users can get thier notifications 
    - the server send real-time notifications for users
## Documentation

**[Documentation](https://documenter.getpostman.com/view/29097873/2sA3kSnNfk)**



