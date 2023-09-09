/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CareTaker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Child` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildEnvironment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildEnvironmentActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildHobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Environment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnvironmentHobbies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Traits` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Child] DROP CONSTRAINT [Child_parent_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnvironment] DROP CONSTRAINT [ChildEnvironment_child_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnvironment] DROP CONSTRAINT [ChildEnvironment_env_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnvironmentActivity] DROP CONSTRAINT [ChildEnvironmentActivity_child_env_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildHobby] DROP CONSTRAINT [ChildHobby_child_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildHobby] DROP CONSTRAINT [ChildHobby_hobby_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Environment] DROP CONSTRAINT [Environment_added_by_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[EnvironmentHobbies] DROP CONSTRAINT [EnvironmentHobbies_env_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[EnvironmentHobbies] DROP CONSTRAINT [EnvironmentHobbies_hobby_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Traits] DROP CONSTRAINT [Traits_activity_id_fkey];

-- DropTable
DROP TABLE [dbo].[Admin];

-- DropTable
DROP TABLE [dbo].[CareTaker];

-- DropTable
DROP TABLE [dbo].[Child];

-- DropTable
DROP TABLE [dbo].[ChildEnvironment];

-- DropTable
DROP TABLE [dbo].[ChildEnvironmentActivity];

-- DropTable
DROP TABLE [dbo].[ChildHobby];

-- DropTable
DROP TABLE [dbo].[Environment];

-- DropTable
DROP TABLE [dbo].[EnvironmentHobbies];

-- DropTable
DROP TABLE [dbo].[Hobby];

-- DropTable
DROP TABLE [dbo].[Traits];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
