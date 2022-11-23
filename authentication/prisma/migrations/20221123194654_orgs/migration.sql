/*
  Warnings:

  - You are about to drop the column `org_roles_id` on the `OrgUser` table. All the data in the column will be lost.
  - You are about to drop the `OrgUser_OrgRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrgRoleToOrgUser_OrgRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `org_role_id` to the `OrgUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrgUser` DROP FOREIGN KEY `OrgUser_org_roles_id_fkey`;

-- DropForeignKey
ALTER TABLE `_OrgRoleToOrgUser_OrgRole` DROP FOREIGN KEY `_OrgRoleToOrgUser_OrgRole_A_fkey`;

-- DropForeignKey
ALTER TABLE `_OrgRoleToOrgUser_OrgRole` DROP FOREIGN KEY `_OrgRoleToOrgUser_OrgRole_B_fkey`;

-- AlterTable
ALTER TABLE `OrgUser` DROP COLUMN `org_roles_id`,
    ADD COLUMN `org_role_id` ENUM('OWNER', 'MODERATOR', 'MEMBER') NOT NULL;

-- DropTable
DROP TABLE `OrgUser_OrgRole`;

-- DropTable
DROP TABLE `_OrgRoleToOrgUser_OrgRole`;

-- AddForeignKey
ALTER TABLE `OrgUser` ADD CONSTRAINT `OrgUser_org_role_id_fkey` FOREIGN KEY (`org_role_id`) REFERENCES `OrgRole`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
