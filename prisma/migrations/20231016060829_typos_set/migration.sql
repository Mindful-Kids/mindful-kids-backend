/*
  Warnings:

  - You are about to drop the `CareTaker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildEnviroment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildEnviromentActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChildHobby` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enviroment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedBack` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CareTaker] DROP CONSTRAINT [CareTaker_genderId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CareTaker] DROP CONSTRAINT [CareTaker_typeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnviroment] DROP CONSTRAINT [ChildEnviroment_childId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnviroment] DROP CONSTRAINT [ChildEnviroment_enviromentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnviromentActivity] DROP CONSTRAINT [ChildEnviromentActivity_childEnviromentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildHobby] DROP CONSTRAINT [ChildHobby_childId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ChildHobby] DROP CONSTRAINT [ChildHobby_hobbyId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Children] DROP CONSTRAINT [Children_parentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Enviroment] DROP CONSTRAINT [Enviroment_addedById_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[EnviromentTraits] DROP CONSTRAINT [EnviromentTraits_enviromentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FeedBack] DROP CONSTRAINT [FeedBack_careTakerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[FeedBack] DROP CONSTRAINT [FeedBack_enviromentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TraitsAcquire] DROP CONSTRAINT [TraitsAcquire_childEnvActivityId_fkey];

-- DropTable
DROP TABLE [dbo].[CareTaker];

-- DropTable
DROP TABLE [dbo].[ChildEnviroment];

-- DropTable
DROP TABLE [dbo].[ChildEnviromentActivity];

-- DropTable
DROP TABLE [dbo].[ChildHobby];

-- DropTable
DROP TABLE [dbo].[Enviroment];

-- DropTable
DROP TABLE [dbo].[FeedBack];

-- CreateTable
CREATE TABLE [dbo].[CareTakers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [typeId] INT NOT NULL,
    [genderId] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [CareTakers_status_df] DEFAULT 1,
    CONSTRAINT [CareTakers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CareTakers_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Enviroments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [startAge] INT NOT NULL,
    [endAge] INT NOT NULL,
    [enviromentPath] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Enviroments_status_df] DEFAULT 1,
    [addedById] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Enviroments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnviroments] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [enviromentId] INT NOT NULL,
    CONSTRAINT [ChildEnviroments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnviromentsActivity] (
    [id] INT NOT NULL IDENTITY(1,1),
    [activityTimeStart] DATETIME2 NOT NULL,
    [activityTimeEnd] DATETIME2 NOT NULL,
    [ChildEnviromentsId] INT NOT NULL,
    CONSTRAINT [ChildEnviromentsActivity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildHobbies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [hobbyId] INT NOT NULL,
    CONSTRAINT [ChildHobbies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Feedback] (
    [id] INT NOT NULL IDENTITY(1,1),
    [careTakerId] INT NOT NULL,
    [enviromentId] INT NOT NULL,
    [rating] FLOAT(53) NOT NULL,
    [comments] NVARCHAR(1000) NOT NULL,
    [time] DATETIME2 NOT NULL,
    CONSTRAINT [Feedback_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CareTakers] ADD CONSTRAINT [CareTakers_genderId_fkey] FOREIGN KEY ([genderId]) REFERENCES [dbo].[Lookup]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CareTakers] ADD CONSTRAINT [CareTakers_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[Lookup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Children] ADD CONSTRAINT [Children_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[CareTakers]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Enviroments] ADD CONSTRAINT [Enviroments_addedById_fkey] FOREIGN KEY ([addedById]) REFERENCES [dbo].[Admin]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroments] ADD CONSTRAINT [ChildEnviroments_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroments] ADD CONSTRAINT [ChildEnviroments_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroments]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviromentsActivity] ADD CONSTRAINT [ChildEnviromentsActivity_ChildEnviromentsId_fkey] FOREIGN KEY ([ChildEnviromentsId]) REFERENCES [dbo].[ChildEnviroments]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobbies] ADD CONSTRAINT [ChildHobbies_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobbies] ADD CONSTRAINT [ChildHobbies_hobbyId_fkey] FOREIGN KEY ([hobbyId]) REFERENCES [dbo].[Hobbies]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentTraits] ADD CONSTRAINT [EnviromentTraits_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroments]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TraitsAcquire] ADD CONSTRAINT [TraitsAcquire_childEnvActivityId_fkey] FOREIGN KEY ([childEnvActivityId]) REFERENCES [dbo].[ChildEnviromentsActivity]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Feedback] ADD CONSTRAINT [Feedback_careTakerId_fkey] FOREIGN KEY ([careTakerId]) REFERENCES [dbo].[CareTakers]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Feedback] ADD CONSTRAINT [Feedback_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroments]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
