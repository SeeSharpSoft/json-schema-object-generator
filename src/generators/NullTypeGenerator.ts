import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { PrimitiveTypeGenerator } from "./PrimitiveTypeGenerator";

export class NullTypeGenerator extends PrimitiveTypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "null";
    }

    protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): any {
        return null;
    }
}
