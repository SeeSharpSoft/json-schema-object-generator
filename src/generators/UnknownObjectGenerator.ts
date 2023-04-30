import { ObjectGenerator } from "./ObjectGenerator";
import { JSONSchema7 } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";

export class UnknownObjectGenerator extends ObjectGenerator {
  handles(schema: JSONSchema7, visitor: NodeVisitor): boolean {
    return schema.hasOwnProperty("type");
  }
}
