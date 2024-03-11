import { ServiceBaseResponse } from "./service-base-response";
import { User } from "../user";

export interface AuthResponse extends ServiceBaseResponse {
    user?: User
}
