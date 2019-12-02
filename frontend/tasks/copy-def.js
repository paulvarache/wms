const { copyFileSync, readFileSync, writeFileSync } = require('fs');

const [dir] = process.argv.slice(2);

copyFileSync(`proto/${dir}_pb.d.ts`, `src/proto/${dir}_pb.d.ts`);

const contents = readFileSync(`proto/${dir}_grpc_web_pb.d.ts`, 'utf-8');

writeFileSync(`src/proto/${dir}_grpc_web_pb.d.ts`, `export * from './${dir}_pb'\n${contents}`);
