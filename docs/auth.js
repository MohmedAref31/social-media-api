export const register = {
  tags: ["Auth"],
  description: "User register a new account",
  operationId: "register",
  security: [],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          $ref: "#/components/schemas/registerBody",
        },
      },
    },
    required: true,
  },
  responses: {
    201: {
      description: "register success",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "60564fcb544047cdc3844818",
              },
              firstName: {
                type: "string",
                example: "Mohamed",
              },
              lastName: {
                type: "string",
                example: "Aref",
              },
              email: {
                type: "string",
                example: "example@example.com",
              },
              profileImage: {
                type: "string",
                example: "/assets/img.jpg",
              },
            },
          },
        },
      },
    },
  },
};

export const login = {
  tags: ["Auth"],
  description: "User login to his account",
  operationId: "login",
  security: [],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/loginBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "login success",
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ApiResponse",
              },
              {
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "60564fcb544047cdc3844818",
                      },
                      firstName: {
                        type: "string",
                        example: "Mohamed",
                      },
                      lastName: {
                        type: "string",
                        example: "Aref",
                      },
                      email: {
                        type: "string",
                        example: "example@example.com",
                      },
                      profileImage: {
                        type: "string",
                        example: "/assets/img.jpg",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
    401: {
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ApiResponse",
              },
              {
                properties: {
                  message: {
                    example: "email or password is wrong",
                  },
                },
              },
            ],
          },
        },
      },
    },
    400: {
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ValidationFailed",
              },
            ],
          },
        },
      },
    },
  },
};

export const googleAuth = {
  tags: ["Auth"],
  description: "user can login with google account",
  operationId: "googleAuth",
  security: [],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ApiResponse",
              },
              {
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "60564fcb544047cdc3844818",
                      },
                      firstName: {
                        type: "string",
                        example: "Mohamed",
                      },
                      lastName: {
                        type: "string",
                        example: "Aref",
                      },
                      email: {
                        type: "string",
                        example: "example@example.com",
                      },
                      profileImage: {
                        type: "string",
                        example: "/assets/img.jpg",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
    401: {
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ApiResponse",
              },
              {
                properties: {
                  message: {
                    example: "google sign in failed",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

export const logout = {
  tags: ["Auth"],
  description: "user can logout from his account",
  operationId: "logout",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            allOf: [
              {
                $ref: "#/definitions/ApiResponse",
              },
              {
                properties: {
                  message: {
                    example: "logout success",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

export const registerBody = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      example: "Mohamed",
    },
    lastName: {
      type: "string",
      example: "Aref",
    },
    email: {
      type: "string",
      example: "example@example.com",
    },
    password: {
      type: "string",
      description: "User password with min length 6 and max length 18",
      example: "123@Abc",
    },
    profileImage: {
      type: "string",
      format: "binary",
      description: "profile image with valid image format",
      example: "img.jpg",
    },
  },
};
export const loginBody = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "example@example.com",
    },
    password: {
      type: "string",
      description: "User password with min length 6 and max length 18",
      example: "123@Abc",
    },
  },
};
