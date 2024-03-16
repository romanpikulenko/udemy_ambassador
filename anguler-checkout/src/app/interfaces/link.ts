import { Product } from "./product";
import { User } from "./user";

export interface Link {
    id: number,
    code: string,
    user: User,
    products: Product[]
}
