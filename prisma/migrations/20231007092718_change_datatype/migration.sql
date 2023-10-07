/*
  Warnings:

  - You are about to alter the column `startAge` on the `Enviroment` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Int`.
  - You are about to alter the column `endAge` on the `Enviroment` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Enviroment] ALTER COLUMN [startAge] INT NOT NULL;
ALTER TABLE [dbo].[Enviroment] ALTER COLUMN [endAge] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
