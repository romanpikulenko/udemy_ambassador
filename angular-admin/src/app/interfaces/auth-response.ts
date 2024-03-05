import { User } from "./user";

export interface AuthResponse {
    responseBody: any,
    success: boolean,
    user?: User
}
