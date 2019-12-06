import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';

export default {
    input: ['proto/inventory_grpc_web_pb.js', 'proto/accounts_grpc_web_pb.js', 'proto/import_grpc_web_pb.js'],
    plugins: [
        common(),
        resolve(),
    ],
    output: {
        format: 'es',
        dir: 'src/proto',
    },
}