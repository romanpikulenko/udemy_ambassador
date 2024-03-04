import { User } from "./user";

export interface AuthResponse {
    responseAnswer: any,
    success: boolean,
    User?: User
}
