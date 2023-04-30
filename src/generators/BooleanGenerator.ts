import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { PrimitiveTypeGenerator } from "./PrimitiveTypeGenerator";

export class BooleanGenerator extends PrimitiveTypeGenerator<boolean> {
  protected getType(): JSONSchema7TypeName {
    return "boolean";
  }

  protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): boolean {
    return false;
  }
}
