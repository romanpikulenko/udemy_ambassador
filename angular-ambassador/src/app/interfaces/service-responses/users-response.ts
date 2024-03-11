import { ServiceBaseResponse } from "./service-base-response";
import { User } from "../user";

export interface UsersResponse extends ServiceBaseResponse {
    users?: User[]
}