import {
    CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
  } from 'sequelize';
  
  import { sequelize } from '@src/db/sequelize';
  
  export const EMPLOYEE_STATUSES = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  } as const;
  
  export type EmployeeStatus =
    (typeof EMPLOYEE_STATUSES)[keyof typeof EMPLOYEE_STATUSES];
  
  export class EmployeeModel extends Model<
    InferAttributes<EmployeeModel>,
    InferCreationAttributes<EmployeeModel>
  > {
    declare id: CreationOptional<string>;
  
    /**
     * Generated automatically by PostgreSQL:
     * EMP000001, EMP000002, ...
     */
    declare employeeCode: CreationOptional<string>;
  
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare department: string;
    declare jobTitle: string;
    declare country: string;
    declare hireDate: Date;
  
    declare status: CreationOptional<EmployeeStatus>;
  
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  EmployeeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
  
      employeeCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
  
        /**
         * Don't add defaultValue here.
         *
         * The PostgreSQL sequence/default created in the
         * migration generates this value.
         */
      },
  
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
  
      department: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  
      jobTitle: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
  
      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
  
      hireDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
  
      status: {
        type: DataTypes.ENUM(
          ...Object.values(EMPLOYEE_STATUSES),
        ),
        allowNull: false,
        defaultValue: EMPLOYEE_STATUSES.ACTIVE,
      },
  
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
  
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
  
      modelName: 'Employee',
  
      tableName: 'employees',
  
      indexes: [
        {
          fields: ['department'],
        },
        {
          fields: ['country'],
        },
        {
          fields: ['status'],
        },
      ],
    },
  );