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

export type fnGenerate<T> = () => T;

export interface NodeGenerator<T> {
  generate(schema: JSONSchema7, visitor: NodeVisitor, next?: fnGenerate<T>): T;
  handles(schema: JSONSchema7, visitor: NodeVisitor): boolean;
}

export interface MutableGenerator {
  addGenerator(generator: NodeGenerator<unknown>): void;
}

export type NodeGeneratorAugmentor = (parser: MutableGenerator) => void;

export function createNodeGenerator(augmentor?: NodeGeneratorAugmentor): NodeGenerator<unknown> {
  const nodeGenerator = new BaseNodeGenerator();
  nodeGenerator.addGenerators(
    new UnknownObjectGenerator(),
    new EmptyTypeGenerator(),
    new NullTypeGenerator(),
    new BooleanGenerator(),
    new IntegerGenerator(),
    new NumberGenerator(),
    new StringGenerator(),
    new ArrayGenerator(),
    new ObjectGenerator(),
    new AnyOfGenerator(),
    new RefNodeGenerator()
  );
  if (augmentor) {
    augmentor(nodeGenerator);
  }

  return nodeGenerator;
}

class BaseNodeGenerator implements NodeGenerator<unknown>, MutableGenerator {
  readonly generators: NodeGenerator<unknown>[];

  constructor() {
    this.generators = [];
  }

  handles(schema: JSONSchema7, visitor: NodeVisitor): boolean {
    return this.generators.some((generator) => generator.handles(schema, visitor));
  }

  generate(schema: JSONSchema7, visitor: NodeVisitor): unknown {
    const suitableGenerators = this.generators.filter((generator) => generator.handles(schema, visitor));
    let index = suitableGenerators.length;
    const next = () => {
      if (index > 0) {
        return suitableGenerators[--index].generate(schema, visitor, next);
      }
      return undefined;
    };
    return next();
  }

  addGenerator(generator: NodeGenerator<unknown>): void {
    this.generators.push(generator);
  }

  addGenerators(...generators: NodeGenerator<unknown>[]): void {
    generators.forEach(this.addGenerator.bind(this));
  }
}
