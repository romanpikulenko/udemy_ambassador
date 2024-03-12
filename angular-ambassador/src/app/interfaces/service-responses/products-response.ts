import { Product } from "../product";
import { PaginationInfo } from "./pagination-info";
import { ServiceBaseResponse } from "./service-base-response";

export interface ProductsResponse extends ServiceBaseResponse {
    products?: Product[]
}

export interface BackendProductsResponse extends ProductsResponse {
    meta?: PaginationInfo
}
