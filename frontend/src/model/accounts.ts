import api from '../proto/accounts_grpc_web_pb';

const { AccountsPromiseClient, CreateUserMessage } = api;

const client = new AccountsPromiseClient('http://localhost:8081', null, null);

const request = new CreateUserMessage();
request.setEmail('varache.paul@gmail.com');
request.setPassword('password');
request.setAccountid(1);

client.createUser(request)
    .then(r => {
        console.log(r);
    });
