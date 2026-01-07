// types/express.d.ts
import { Request } from 'express';
import { Sequelize } from 'sequelize';

declare global {
  namespace Express {
    interface Request {
      masterSequelize?: Sequelize;
      company?: any;
      user:any;
      models?: {
        Roles: any;
        Module: any;
        RoleAccess: any;
        // Add other models as needed
      };
    }
  }
}


// declare namespace Express {
//   export interface Request {
//     user: any
//   }
// }
