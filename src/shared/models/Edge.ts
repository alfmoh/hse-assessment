import { ILabel } from "./Label";
import { INode } from "./Node";

export interface IEdge {
  source: INode;
  target: INode;
  label: ILabel;
}
