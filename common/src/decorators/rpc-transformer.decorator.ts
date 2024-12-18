import { RpcException } from '@nestjs/microservices';

export function RpcTransformer() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        throw new RpcException(error);
      }
    };

    return descriptor;
  };
}
