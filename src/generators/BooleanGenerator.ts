import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class BooleanGenerator extends TypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "boolean";
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return false;
    }

    protected isPrimitiveType(): boolean {
        return true;
    }
}
