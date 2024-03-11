import { Link } from "../link";
import { ServiceBaseResponse } from "./service-base-response";

export interface LinkResponse extends ServiceBaseResponse {
    links?: Link[]
}
