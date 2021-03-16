import { TypeGenerator } from "./TypeGenerator";

export abstract class PrimitiveTypeGenerator extends TypeGenerator {
    protected isPrimitiveType(): boolean {
        return true;
    }
}
