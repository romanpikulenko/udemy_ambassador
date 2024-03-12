import { Stat } from "../stat";
import { ServiceBaseResponse } from "./service-base-response";

export interface StatResponse extends ServiceBaseResponse {
    stats?: Stat[]
}
