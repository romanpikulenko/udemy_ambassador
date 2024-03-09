import { Order } from "./order";
import { ServiceBaseResponse } from "./service-base-response";

export interface OrdersResponse extends ServiceBaseResponse {
    orders?: Order[]
}
