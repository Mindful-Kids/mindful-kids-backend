BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CareTaker] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [gender] BIT NOT NULL CONSTRAINT [CareTaker_gender_df] DEFAULT 1,
    [status] BIT NOT NULL CONSTRAINT [CareTaker_status_df] DEFAULT 1,
    CONSTRAINT [CareTaker_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CareTaker_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Children] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dateOfBirth] DATETIME2 NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [parentId] INT NOT NULL,
    [age] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [gender] BIT NOT NULL CONSTRAINT [Children_gender_df] DEFAULT 1,
    [status] BIT NOT NULL CONSTRAINT [Children_status_df] DEFAULT 1,
    CONSTRAINT [Children_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnviromentActivity] (
    [id] INT NOT NULL IDENTITY(1,1),
    [activityTimeStart] DATETIME2 NOT NULL,
    [activityTimeEnd] DATETIME2 NOT NULL,
    [childEnviromentId] INT NOT NULL,
    CONSTRAINT [ChildEnviromentActivity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnviroment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [enviromentId] INT NOT NULL,
    CONSTRAINT [ChildEnviroment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildHobby] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [hobbyId] INT NOT NULL,
    CONSTRAINT [ChildHobby_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Hobbies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Hobbies_status_df] DEFAULT 1,
    CONSTRAINT [Hobbies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EnviromentHobbies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [enviromentId] INT NOT NULL,
    [hobbyId] INT NOT NULL,
    CONSTRAINT [EnviromentHobbies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Traits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [learning] FLOAT(53) NOT NULL,
    [confidance] FLOAT(53) NOT NULL,
    [publicSpeaking] FLOAT(53) NOT NULL,
    [communicationSkills] FLOAT(53) NOT NULL,
    [sympthy] FLOAT(53) NOT NULL,
    [honesty] FLOAT(53) NOT NULL,
    [responsibility] FLOAT(53) NOT NULL,
    [activityId] INT NOT NULL,
    CONSTRAINT [Traits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Enviroment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [startAge] NVARCHAR(1000) NOT NULL,
    [endAge] NVARCHAR(1000) NOT NULL,
    [enviromentPath] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Enviroment_status_df] DEFAULT 1,
    [addedById] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Enviroment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Admin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Admin_status_df] DEFAULT 1,
    [image] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Admin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Admin_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[Children] ADD CONSTRAINT [Children_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[CareTaker]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviromentActivity] ADD CONSTRAINT [ChildEnviromentActivity_childEnviromentId_fkey] FOREIGN KEY ([childEnviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroment] ADD CONSTRAINT [ChildEnviroment_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_hobbyId_fkey] FOREIGN KEY ([hobbyId]) REFERENCES [dbo].[Hobbies]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentHobbies] ADD CONSTRAINT [EnviromentHobbies_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentHobbies] ADD CONSTRAINT [EnviromentHobbies_hobbyId_fkey] FOREIGN KEY ([hobbyId]) REFERENCES [dbo].[Hobbies]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Traits] ADD CONSTRAINT [Traits_activityId_fkey] FOREIGN KEY ([activityId]) REFERENCES [dbo].[ChildEnviromentActivity]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Enviroment] ADD CONSTRAINT [Enviroment_addedById_fkey] FOREIGN KEY ([addedById]) REFERENCES [dbo].[Admin]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
