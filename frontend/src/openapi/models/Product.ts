/* tslint:disable */
/* eslint-disable */
/**
 * Order API
 * Use this API to handle create orders from frontend 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists } from '../runtime';
/**
 * 
 * @export
 * @interface Product
 */
export interface Product {
    [key: string]: any | any;
    /**
     * 
     * @type {string}
     * @memberof Product
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    quantity?: number;
    /**
     * Options for product
     * @type {{ [key: string]: any; }}
     * @memberof Product
     */
    options?: { [key: string]: any; };
}

/**
 * Check if a given object implements the Product interface.
 */
export function instanceOfProduct(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ProductFromJSON(json: any): Product {
    return ProductFromJSONTyped(json, false);
}

export function ProductFromJSONTyped(json: any, ignoreDiscriminator: boolean): Product {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
            ...json,
        'id': !exists(json, 'id') ? undefined : json['id'],
        'quantity': !exists(json, 'quantity') ? undefined : json['quantity'],
        'options': !exists(json, 'options') ? undefined : json['options'],
    };
}

export function ProductToJSON(value?: Product | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
            ...value,
        'id': value.id,
        'quantity': value.quantity,
        'options': value.options,
    };
}

