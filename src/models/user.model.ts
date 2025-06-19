import {
  Model, DataTypes, InferAttributes,
  InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../config/db';

interface UserModel
  extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailToken?: string;
  emailTokenExpires?: Date;
}

export const User = sequelize.define<UserModel>('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(32), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(128), unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING(60), allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailToken: { type: DataTypes.STRING(64) },
  emailTokenExpires: { type: DataTypes.DATE },
});
