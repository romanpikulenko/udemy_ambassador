import { Product } from "./product";
import { ServiceBaseResponse } from "./service-base-response";

export interface ProductsResponse extends ServiceBaseResponse {
    products?: Product[]
}
