# VUTTR (Very Useful Tools to Remember)
This is VUTTR (Very Useful Tools to Remember)

Its tool to search and share tools that help the day to day

## Instalation
 - Clone this repo in your device.
 - Open the folder by your terminal and type one of the commands below
    - yarn, or
    - npm install
  - Done that, run one of the commands below:
    - yarn start, or
    - npm start

PS.: Must have NodeJs installed

## Sturcture Database
VUTTR uses MongoDB as the database.

 - Struture User

    User: {
      name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
  }

Notes: PassworResetToken and PasswordResetExpires are are entered / changed in the request to have forgotten my password.


- Structure Tool
  Tool: {
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
  }

## Authentication
To make use of the features of VUTTR, it is necessary to register a user and password.

### Register
Use route '/register' with POST method to register a new user. Use a JSON pattern like the template below.

  {
    "name":"Gabriel Stamato",
    "email": "stamato7@gmail.com",
    "password": "123456"
  }

Notes: - VUTTR uses encryption for password storage provided
       - After registration, VUTTR returns a token jwt so that it can access the other functionalities.

### Auth
The user can login at any time, through previously registered email and password (see register)

Use route '/auth' to login with POST method. Use a JSON pattern like the template below.

  {
    "email": "stamato7@gmail.com",
    "password": "123456"
  }

VUTTR returns a token jwt so that it ca acces the order functionalities.

Notes: - The jwt token lasts only for 1 day. After that you will need to log in again.

### Forgot Password
If the user forgets the password, it is possible to enter the registered email to send a token to perform the exchange of the old password with a new one

Use route '/forgot_pass' with POST method. Use a JSON pattern like the template below.

  {
    "email": "stamato7@gmail.com"
  }

With this, the VUTTR will forward an email with the token to access the route to change the password. Use this route '/reset_pass' with POST method and the token received by email, your registered email and the new password. Use a JSON pattern like the template below.

  {
    "token": "2cd03c47913c0de5a0d6de66ef624755941193ed",
    "email": "stamato7@gmail.com",
    "password": "654321"
  }

Notes: - The token for password recovery is valid for only 1 hour.

## Tools
VUTTR allows you to register, search and delete tools according to the user's needs.

### Register
To Register a new Tool use the route '/tools' with POST method. Use a JSON pattern like the template below.

  {
    "name": "VUTTR",
    "description": "Its tool to search and share tools that help the day to day",
    "link": "vuttr.com",
    "tags": ["tools", "tool", "search"]
  }

Note: - You can register as many tags as necessary.

### List all tools
To List all tools registered in the database, use the route '/tools' with GET method. Will be returned an array with all the tools registered.

### Search a tool
You can search for tools in VUTTR by tag or by ID.

#### Search by tag
Use the route '/tools/search' with GET method. Use a JSON pattern like the template below.

  {
    "tag": "search"
  }

Will be returned an array with all the tools registered with tag requested.

#### Search by Id
Use the route '/tools/search/:toolId' with GET method.
Will be returned a JSON object of the tool relative to the informed ID.

### Delete a tool
To delete a tool, use the route '/tools/destroy/:toolId' with DELETE method.