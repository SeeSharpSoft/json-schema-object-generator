import { NodeVisitor } from "./NodeVisitor";
import { ObjectGenerator } from "./generators/ObjectGenerator";
import { RefNodeGenerator } from "./generators/RefNodeGenerator";
import { JSONSchema7 } from "json-schema";
import { EmptyTypeGenerator } from "./generators/UndefinedTypeGenerator";
import { UnknownObjectGenerator } from "./generators/UnknownObjectGenerator";
import { ArrayGenerator } from "./generators/ArrayGenerator";
import { StringGenerator } from "./generators/StringGenerator";
import { NumberGenerator } from "./generators/NumberGenerator";
import { IntegerGenerator } from "./generators/IntegerGenerator";
import { BooleanGenerator } from "./generators/BooleanGenerator";
import { NullTypeGenerator } from "./generators/NullTypeGenerator";
import { AnyOfGenerator } from "./generators/AnyOfGenerator";

export interface NodeGenerator {
    generate(schema: JSONSchema7, context: NodeVisitor): any;
    handles(schema: JSONSchema7, context: NodeVisitor): boolean;
}

export interface MutableGenerator {
    addGenerator(generator: NodeGenerator): void;
}

export type NodeGeneratorAugmentor = (parser: MutableGenerator) => void;

export function createNodeGenerator(augmentor?: NodeGeneratorAugmentor): NodeGenerator {
    const nodeGenerator = new BaseNodeGenerator();
    if (augmentor) {
        augmentor(nodeGenerator);
    }
    nodeGenerator.addGenerators(
        new RefNodeGenerator(),
        new AnyOfGenerator(),
        new ObjectGenerator(),
        new ArrayGenerator(),
        new StringGenerator(),
        new NumberGenerator(),
        new IntegerGenerator(),
        new BooleanGenerator(),
        new NullTypeGenerator(),
        new EmptyTypeGenerator(),
        new UnknownObjectGenerator()
    );

    return nodeGenerator;
}

export class BaseNodeGenerator implements NodeGenerator, MutableGenerator {
    readonly generators: NodeGenerator[];

    constructor() {
        this.generators = [];
    }

    handles(schema: JSONSchema7, context: NodeVisitor): boolean {
        return !!this.findGenerator(schema, context);
    }

    generate(schema: JSONSchema7, context: NodeVisitor): any {
        return this.findGenerator(schema, context)?.generate(schema, context);
    }

    findGenerator(schema: JSONSchema7, context: NodeVisitor): NodeGenerator | undefined {
        return this.generators.find((generator) => generator.handles(schema, context));
    }

    addGenerator(generator: NodeGenerator): void {
        this.generators.push(generator);
    }

    addGenerators(...generators: NodeGenerator[]): void {
        generators.forEach(this.addGenerator.bind(this));
    }
}
