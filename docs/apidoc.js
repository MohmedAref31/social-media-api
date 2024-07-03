import { googleAuth, login, loginBody, logout, register, registerBody } from "./auth.js";
import { acceptFriendRequest, cancelFriendRequest, getFriendRequests, sendFriendRequest } from "./friendRequests.js";

export const apiDoc = {
  openapi: "3.0.1",
  info: {
    version: "0.1",
    title: "Socail Media REST API Documentation",
    description:
      "REST API for social media app which have [users, posts, comments, status] functionalities",
    contact: {
      name: "Mohamed Aref",
      email: "mohmedaref2003@gmail.com",
    },
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server ",
    },
  ],
  apis: ["./routes/*.js"],
  tags: [
    {
      name: "Auth",
    },
    {
        name:"Friend Requests",
    }
  ],
  paths: {
    "/api/v1/auth/register": {
      post: register,
      summary: "user register new account",
    },
    "/api/v1/auth/login": {
      post: login,
    },
    "/api/v1/auth/google":{
        get:googleAuth,
    },
    "/api/v1/auth/logout":{
        post: logout,
    },
    "/api/v1/friend-requests":{
        get: getFriendRequests,
    },
    "/api/v1/friend-requests/{receiverId}":{
        post:sendFriendRequest
    }, 
    "/api/v1/friend-requests/accept/{requestId}":{
        post:acceptFriendRequest
    },
    "/api/v1/friend-requests/cancel/{requestId}":{
        delete:cancelFriendRequest
    },
   
  },
  components: {
    schemas: {
      registerBody,
      loginBody,
    },
  },
  definitions: {
    ApiResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "Operation successful",
        },
        data: {
          type: "object",
        },
      },
    },
    ValidationFailed: {
      allOf: [
        { $ref: "#/definitions/ApiResponse" },
        {
          properties: {
            message: {
              type: "string",
              example: "validation failed",
            },
            status: {
              type: "string",
              example: "failed",
            },
            data: {
              properties: {
                errors: {
                  type: "array",
                  example: [
                    {
                      type: "field",
                      value: "",
                      msg: "password is required",
                      path: "password",
                      location: "body",
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    },
  },
};
