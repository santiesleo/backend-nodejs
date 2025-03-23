import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from '../interfaces/user.interface';

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    // Métodos para las asociaciones
    declare getRoles: () => Promise<any[]>;
    declare addRoles: (roleIds: number[]) => Promise<void>;
    declare setRoles: (roleIds: number[]) => Promise<void>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
        timestamps: true,
        paranoid: true,
    }
);

export default User;