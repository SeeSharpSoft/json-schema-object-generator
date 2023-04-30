import { TypeGenerator } from "./TypeGenerator";

export abstract class PrimitiveTypeGenerator<T> extends TypeGenerator<T> {
  protected isPrimitiveType(): boolean {
    return true;
  }
}
