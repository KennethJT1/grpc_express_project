const PROTO_PATH = "./proto/user.proto";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import {v4 as uuid} from "uuid"

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const usersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
const users = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "John Bolton",
        email: "email1@gmail.com",
        age: 23,
         
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Mary Anne",
        email: "email2@gmail.com",
        age: 45,
        
    }
];

server.addService(usersProto.UserService.service, {
    getUsers: (_, callback) => {
        callback(null, { users }); // this {users} is comming from user.proto repeated User users = 1; on line 22
    },

    getUser: (call, callback) => {
        let user = users.find(n => n.id == call.request.id);

        if (user) {
            callback(null, user);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    addUser: (call, callback) => {
        let user = call.request;
        
        user.id = uuid();
        users.push(user);
        callback(null, user);
    },

    update: (call, callback) => {
        const existingUser = users.find(n => n.id == call.request.id);

        if (existingUser) {
            existingUser.name = call.request.name;
            existingUser.email = call.request.email;
            existingUser.age = call.request.age;
            callback(null, existingUser);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        const existingUserIndex = users.findIndex(
            n => n.id == call.request.id
        );

        if (existingUserIndex != -1) {
            users.splice(existingUserIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});
server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(), ()=> {
    console.log("Server running at http://127.0.0.1:30043");
    server.start();
});