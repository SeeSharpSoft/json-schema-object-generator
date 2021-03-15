import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class NumberGenerator extends TypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "number";
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return 0;
    }

    protected isPrimitiveType(): boolean {
        return true;
    }
}
