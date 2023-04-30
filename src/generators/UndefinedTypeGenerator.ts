import { JSONSchema7 } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { PrimitiveTypeGenerator } from "./PrimitiveTypeGenerator";

export class EmptyTypeGenerator extends PrimitiveTypeGenerator {
  protected getType(): undefined {
    return undefined;
  }

  protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): any {
    return null;
  }
}
