import {
    CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
  } from 'sequelize';
  
  import { sequelize } from '@src/db/sequelize';
  
  export class EmployeeSalaryModel extends Model<
    InferAttributes<EmployeeSalaryModel>,
    InferCreationAttributes<EmployeeSalaryModel>
  > {
    declare id: CreationOptional<string>;
  
    declare employeeId: string;
  
    /**
     * PostgreSQL DECIMAL is returned as string by Sequelize
     * to preserve exact decimal precision.
     */
    declare baseSalary: string;
  
    declare currency: string;
  
    declare effectiveFrom: Date;
  
    declare reason: CreationOptional<string | null>;
  
    declare createdAt: CreationOptional<Date>;
  }
  
  EmployeeSalaryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
  
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'employee_id',
  
        references: {
          model: 'employees',
          key: 'id',
        },
  
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
  
      baseSalary: {
        type: DataTypes.DECIMAL(15, 2),
        field: 'base_salary',
        allowNull: false,
      },
  
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
  
      effectiveFrom: {
        type: DataTypes.DATEONLY,
        field: 'effective_from',
        allowNull: false,
      },
  
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
  
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
  
      modelName: 'EmployeeSalary',
  
      tableName: 'employee_salaries',
  
      timestamps: true,
  
      /**
       * Salary records are append-only.
       * There is intentionally no updatedAt column.
       */
      updatedAt: false,
  
      indexes: [
        {
          fields: ['employee_id', 'effective_from'],
        },
      ],
    },
  );