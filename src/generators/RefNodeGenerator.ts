import { NodeGenerator } from "../NodeGenerator";
import { NodeVisitor } from "../NodeVisitor";
import { JSONSchema7 } from "json-schema";
import { getRefPath } from "../Utils";

export class RefNodeGenerator implements NodeGenerator<unknown> {
  handles(schema: JSONSchema7, visitor: NodeVisitor): boolean {
    return schema.$ref ? schema.$ref.startsWith("#") : false;
  }

  generate(schema: JSONSchema7, visitor: NodeVisitor): unknown {
    return visitor.generate(getRefPath(<string>schema.$ref));
  }
}
