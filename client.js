const PROTO_PATH = "./proto/user.proto";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;
const client = new UserService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

export default client;