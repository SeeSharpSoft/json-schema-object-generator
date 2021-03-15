import { JSONSchema7 } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { TypeGenerator } from "./TypeGenerator";

export class EmptyTypeGenerator extends TypeGenerator {
    protected getType(): undefined {
        return undefined;
    }

    protected getEmptyValue(schema: JSONSchema7, context: NodeVisitor): any {
        return null;
    }

    protected isPrimitiveType(): boolean {
        return true;
    }
}
