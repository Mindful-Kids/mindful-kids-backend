/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `Enviroment` table. All the data in the column will be lost.
  - Added the required column `iamge` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `CareTaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Enviroment` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Admin] DROP COLUMN [imagePath];
ALTER TABLE [dbo].[Admin] ADD [iamge] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[CareTaker] ADD [image] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Enviroment] DROP COLUMN [imagePath];
ALTER TABLE [dbo].[Enviroment] ADD [image] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
