const { copyFileSync, readFileSync, writeFileSync } = require('fs');

copyFileSync('proto/api_pb.d.ts', 'src/proto/api_pb.d.ts');

const contents = readFileSync('proto/api_grpc_web_pb.d.ts', 'utf-8');

writeFileSync('src/proto/api_grpc_web_pb.d.ts', `export * from './api_pb'\n${contents}`);
