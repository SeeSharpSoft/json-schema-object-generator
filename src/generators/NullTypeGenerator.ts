import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class NullTypeGenerator extends TypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "null";
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return null;
    }

    protected isPrimitiveType(): boolean {
        return true;
    }
}
