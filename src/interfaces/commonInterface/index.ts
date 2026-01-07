import { Request } from 'express';
import { IncomingHttpHeaders } from "http";


export interface MyUserRequest extends Request {
    get: any,
    cookies:any,
    cookie:any,
    extraParameter: any,
    // Use `user?:` here instead of `user:`.
    [key: string]: any;
    dbName: any,
    connectionData: any,
    context:any,
    masterSequelize?: any;
    company?: any;
    user: any;
    body: any;
    models?: {
        Roles: any;
        Module: any;
        RoleAccess: any;
        // Add other models as needed
    };
    headers: IncomingHttpHeaders & {
        authorization?: string;
        Authorization?: string;
        get: (name: string) => string | undefined;
    };
}

export interface MyResponse extends Response {
    // Use `user?:` here instead of `user:`.

    message: string,
    data?: any
}

export interface PayloadFnProps {
    without_middleware: any
    role: string | undefined; // Role can be a string or undefined
    Controller: new (...args: any[]) => any; // Controller class constructor type,
    controllerInstance: string;
    extraParameter: any;
    route: string;
}



export interface RouteConstant {
    method: string; // HTTP methods
    route: string; // URL route (e.g., '/get-role-details')
    handler: any; // Express request handler function
}

export interface ControllerRouteFileMappingProp {
    routeConstant: RouteConstant[]; // Array of route objects
    routerFile: any
}




type FieldType = "string" | "number" | "boolean" | "object" | "array";

export interface ValidationSchema {
    [key: string]: {
        type: FieldType;
        required: boolean;
        length?: number; // For exact length validation
        minLength?: number; // For minimum length
        maxLength?: number; // For maximum length
        pattern?: RegExp; // For pattern matching (e.g., email, phone)
        customValidator?: (value: any) => string | null; // For custom validation logic
    };
}
