"use strict";

import { QueryInterface, DataTypes, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    /**
     * Sequence used to generate human-readable employee codes:
     * EMP000001, EMP000002, ...
     */
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE employee_code_seq
      START WITH 1
      INCREMENT BY 1;
    `);

    /**
     * Employees
     */
    await queryInterface.createTable("employees", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      employeeCode: {
        type: DataTypes.STRING(20),
        field: 'employee_code',
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.literal(
          "'EMP' || LPAD(nextval('employee_code_seq')::text, 6, '0')"
        ),
      },

      firstName: {
        type: DataTypes.STRING(100),
        field: 'first_name',
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING(100),
        field: 'last_name',
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
        field: 'job_title',
        allowNull: false,
      },

      country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      hireDate: {
        type: DataTypes.DATEONLY,
        field: 'hire_date',
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    /**
     * Employee salary history
     *
     * Append-only:
     * Salary changes create a new record instead of modifying
     * the previous salary record.
     */
    await queryInterface.createTable("employee_salaries", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      employeeId: {
        type: DataTypes.UUID,
        field: 'employee_id',
        allowNull: false,

        references: {
          model: "employees",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    /**
     * Employee indexes
     *
     * employeeCode and email already receive indexes because
     * of their UNIQUE constraints.
     */
    await queryInterface.addIndex("employees", ["department"], {
      name: "idx_employees_department",
    });

    await queryInterface.addIndex("employees", ["country"], {
      name: "idx_employees_country",
    });

    await queryInterface.addIndex("employees", ["status"], {
      name: "idx_employees_status",
    });

    /**
     * Optimizes fetching salary history/current salary:
     *
     * SELECT ...
     * WHERE employeeId = ?
     * ORDER BY effectiveFrom DESC
     */
    await queryInterface.addIndex(
      "employee_salaries",
      ["employee_id", "effective_from"],
      {
        name: "uq_employee_salaries_employee_effective",
        unique: true,
      }
    );
  },

  async down(queryInterface: QueryInterface) {
    /**
     * Drop child table first because it references employees.
     */
    await queryInterface.dropTable("employee_salaries");

    await queryInterface.dropTable("employees");

    /**
     * Sequelize creates a PostgreSQL ENUM type for status.
     */
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_employees_status";
    `);

    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS employee_code_seq;
    `);
  },
};