import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';

export default {
    input: 'proto/api_grpc_web_pb.js',
    plugins: [
        common(),
        resolve(),
    ],
    output: {
        format: 'es',
        file: 'src/proto/api_grpc_web_pb.js',
    },
}