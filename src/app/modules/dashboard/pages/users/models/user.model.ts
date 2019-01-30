import { PermisionsModel } from './permisions.model';
import { RolModel } from './rol.model';

export class UserModel {
    id: string;
    rol: RolModel;
    route: number;
    permision: PermisionsModel;
    name: string; // firstname and lastname
    email: string;
    create_at: string;
    timestamp_create_at: string;
    last_conexion: string;
    timestamp_last_conexion: string;
    status: number; // 0 habilitado, 1 inhabilitado
}
