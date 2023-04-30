import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { PrimitiveTypeGenerator } from "./PrimitiveTypeGenerator";

export class NumberGenerator extends PrimitiveTypeGenerator<number> {
  protected getType(): JSONSchema7TypeName {
    return "number";
  }

  protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): number {
    return 0;
  }
}
