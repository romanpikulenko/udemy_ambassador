import { Order } from "./order";
import { Product } from "./product";

export interface Link {
    id: number,
    code: string,
    orders: Order[],
    products: Product[]
}
