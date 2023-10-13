/*
  Warnings:

  - You are about to drop the column `activityId` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `communicationSkills` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `confidance` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `honesty` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `learning` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `publicSpeaking` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `responsibility` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the column `sympthy` on the `Traits` table. All the data in the column will be lost.
  - You are about to drop the `EnviromentHobbies` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Traits` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[EnviromentHobbies] DROP CONSTRAINT [EnviromentHobbies_enviromentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[EnviromentHobbies] DROP CONSTRAINT [EnviromentHobbies_hobbyId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Traits] DROP CONSTRAINT [Traits_activityId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Traits] DROP COLUMN [activityId],
[communicationSkills],
[confidance],
[honesty],
[learning],
[publicSpeaking],
[responsibility],
[sympthy];
ALTER TABLE [dbo].[Traits] ADD [name] NVARCHAR(1000) NOT NULL,
[status] BIT NOT NULL CONSTRAINT [Traits_status_df] DEFAULT 1;

-- DropTable
DROP TABLE [dbo].[EnviromentHobbies];

-- CreateTable
CREATE TABLE [dbo].[EnviromentTraits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [enviromentId] INT NOT NULL,
    [traitId] INT NOT NULL,
    CONSTRAINT [EnviromentTraits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SkillsAquire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childEnvActivityId] INT NOT NULL,
    [traitId] INT NOT NULL,
    [value] FLOAT(53) NOT NULL,
    CONSTRAINT [SkillsAquire_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentTraits] ADD CONSTRAINT [EnviromentTraits_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentTraits] ADD CONSTRAINT [EnviromentTraits_traitId_fkey] FOREIGN KEY ([traitId]) REFERENCES [dbo].[Traits]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SkillsAquire] ADD CONSTRAINT [SkillsAquire_traitId_fkey] FOREIGN KEY ([traitId]) REFERENCES [dbo].[Traits]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
