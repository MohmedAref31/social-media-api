


export const getFriendRequests = {
    tags:["Friend Requests"],
    description:"user get his friend requests",
    responses:{
        200:{
            description:"success",
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                        {
                            $ref:'#/definitions/ApiResponse',
                        },
                        {
                            properties:{
                                data:{
                                    type:'array',
                                    example:[
                                        {
                                            sender:'65e0a20149a5ccabcdb0e72f',
                                            receiver:'65e0a20149a5ccabcdb0e72f',
                                            createdAt:'2024-03-19T12:10:28.551+00:00'
                                        }
                                    ]
                                }
                            }
                        }
                    ] 
                    }
                   
                }
            }
        }
    }
}

export const sendFriendRequest = {
    tags:["Friend Requests"],
    description: 'user send friend request to another user',
    parameters:[
        {
            in:'url',
            name:'receiverId',
            schema:{
                type:'string',
                required:true,
                example:"65e0a20149a5ccabcdb0e72f"
            }
        }
    ],

    responses:{
        200:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ApiResponse"
                            },
                            {
                                properties:{
                                    message:{
                                        example:"your friend request has been sent"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        400:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ValidationFailed"
                            },
                            {
                                properties:{
                                    data:{
                                        properties:{
                                            errors: {
                                                example: [
                                                  {
                                                    type: "param",
                                                    value: "",
                                                    msg: "receiver Id is required",
                                                    path: "receiverId",
                                                    location: "url",
                                                  },
                                                ]
                                              },
                                        }
                                    }
                                }
                            }
                            
                        ]
                    }
                }
            }
        }
    }
    
}
export const acceptFriendRequest = {
    tags:["Friend Requests"],
    description: 'user send friend request to another user',
    parameters:[
        {
            in:'url',
            name:'requestId',
            description:"friend request id",
            schema:{
                type:'string',
                required:true,
                example:"65e0a20149a5ccabcdb0e72f"
            }
        }
    ],

    responses:{
        200:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ApiResponse"
                            },
                            {
                                properties:{
                                    message:{
                                        example:"Mohamed Aref and you are friends now",
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        400:{
            description:"data validation error",
            content:{
                'application/json':{

                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ValidationFailed"
                            },
                            {
                                properties:{
                                    data:{
                                        properties:{
                                            errors: {
                                                example: [
                                                  {
                                                    type: "param",
                                                    value: "",
                                                    msg: "request Id is required",
                                                    path: "requestId",
                                                    location: "url",
                                                  },
                                                ]
                                              },
                                        }
                                    }
                                }
                            }
                            
                        ]
                    }
                }
            }
        },
        404:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ApiResponse"
                            },
                            {
                                properties:{
                                    message:{
                                        example:"some thing went wrong"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
    
}
export const cancelFriendRequest = {
    tags:["Friend Requests"],
    description: 'user send friend request to another user',
    parameters:[
        {
            in:'url',
            name:'requestId',
            schema:{
                type:'string',
                required:true,
                example:"65e0a20149a5ccabcdb0e72f"
            }
        }
    ],

    responses:{
        200:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ApiResponse"
                            },
                            {
                                properties:{
                                    message:{
                                        example:"friend request cancelled successfully",
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },
        400:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ValidationFailed"
                            },
                            {
                                properties:{
                                    data:{
                                        properties:{
                                            errors: {
                                                example: [
                                                  {
                                                    type: "param",
                                                    value: "",
                                                    msg: "receiver Id is required",
                                                    path: "receiverId",
                                                    location: "url",
                                                  },
                                                ]
                                              },
                                        }
                                    }
                                }
                            }
                            
                        ]
                    }
                }
            }
        },
        404:{
            content:{
                'application/json':{
                    schema:{
                        allOf:[
                            {
                                $ref:"#/definitions/ApiResponse"
                            },
                            {
                                properties:{
                                    message:{
                                        example:"there is no friend request with id 65e0a20149a5ccabcdb0e72f"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
    
}