import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { NodeVisitor } from "../NodeVisitor";
import { PrimitiveTypeGenerator } from "./PrimitiveTypeGenerator";
import { expandN } from "regex-to-strings";

export class StringGenerator extends PrimitiveTypeGenerator {
    protected getType(): JSONSchema7TypeName {
        return "string";
    }

    protected getEmptyValue(schema: JSONSchema7, visitor: NodeVisitor): any {
        if (schema.pattern !== undefined) {
            return expandN(RegExp(schema.pattern), 1)[0];
        }
        if (schema.format !== undefined) {
            return this.getFormattedValue(schema.format);
        }
        if (schema.minLength !== undefined) {
            return expandN(RegExp("w{" + schema.minLength + "}"), 1)[0];
        }
        return "";
    }

    protected getFormattedValue(format: string): string {
        switch (format) {
            case "date-time":
                return new Date().toISOString();
            case "date":
                return new Date().toISOString().substring(0, 10);
            case "time":
                return new Date().toISOString().substring(11);
            case "regex":
                return "[A-Z].+";
            case "email":
            case "idn-email":
            case "hostname":
            case "idn-hostname":
            case "ipv4":
            case "ipv6":
            case "uri":
            case "uri-reference":
            case "iri":
            case "iri-reference":
            case "uri-template":
            case "json-pointer":
            case "relative-json-pointer":
            default:
                throw new Error("unsupported format: " + format);
        }
    }
}
