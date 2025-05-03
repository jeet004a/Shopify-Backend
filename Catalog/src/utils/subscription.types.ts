export type TOPIC_TYPE="OrderEvents" | "CatalogEvents"

export enum OrderEvent{
    CREATE_ORDER="create_order",
    CANCEL_ORDER="cancel_order"
}


export interface MessageType{
    headers?:Record<string,any>;
    event:OrderEvent;
    data:Record<string,any>
}