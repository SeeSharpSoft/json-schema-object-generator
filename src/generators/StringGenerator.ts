import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class StringGenerator extends TypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "string";
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return "";
    }

    protected isPrimitiveType(): boolean {
        return true;
    }
}
