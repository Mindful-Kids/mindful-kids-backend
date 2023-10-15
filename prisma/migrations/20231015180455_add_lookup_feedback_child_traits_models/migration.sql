BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Lookup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [category] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Lookup_pkey] PRIMARY KEY CLUSTERED ([id])
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

-- CreateTable
CREATE TABLE [dbo].[CareTaker] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [typeId] INT NOT NULL,
    [genderId] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
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
    [image] NVARCHAR(1000) NOT NULL,
    [genderId] INT NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Children_status_df] DEFAULT 1,
    CONSTRAINT [Children_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Traits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Traits_status_df] DEFAULT 1,
    CONSTRAINT [Traits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Enviroment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [startAge] INT NOT NULL,
    [endAge] INT NOT NULL,
    [enviromentPath] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Enviroment_status_df] DEFAULT 1,
    [addedById] INT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Enviroment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Hobbies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] BIT NOT NULL CONSTRAINT [Hobbies_status_df] DEFAULT 1,
    CONSTRAINT [Hobbies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnviroment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [enviromentId] INT NOT NULL,
    CONSTRAINT [ChildEnviroment_pkey] PRIMARY KEY CLUSTERED ([id])
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
CREATE TABLE [dbo].[ChildHobby] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [hobbyId] INT NOT NULL,
    CONSTRAINT [ChildHobby_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EnviromentTraits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [enviromentId] INT NOT NULL,
    [traitId] INT NOT NULL,
    CONSTRAINT [EnviromentTraits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TraitsAcquire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childEnvActivityId] INT NOT NULL,
    [traitId] INT NOT NULL,
    [value] FLOAT(53) NOT NULL,
    CONSTRAINT [TraitsAcquire_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildTraits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [childId] INT NOT NULL,
    [traitId] INT NOT NULL,
    CONSTRAINT [ChildTraits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FeedBack] (
    [id] INT NOT NULL IDENTITY(1,1),
    [careTakerId] INT NOT NULL,
    [enviromentId] INT NOT NULL,
    [rating] FLOAT(53) NOT NULL,
    [comments] NVARCHAR(1000) NOT NULL,
    [time] DATETIME2 NOT NULL,
    CONSTRAINT [FeedBack_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CareTaker] ADD CONSTRAINT [CareTaker_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[Lookup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CareTaker] ADD CONSTRAINT [CareTaker_genderId_fkey] FOREIGN KEY ([genderId]) REFERENCES [dbo].[Lookup]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Children] ADD CONSTRAINT [Children_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[CareTaker]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Children] ADD CONSTRAINT [Children_genderId_fkey] FOREIGN KEY ([genderId]) REFERENCES [dbo].[Lookup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Enviroment] ADD CONSTRAINT [Enviroment_addedById_fkey] FOREIGN KEY ([addedById]) REFERENCES [dbo].[Admin]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroment] ADD CONSTRAINT [ChildEnviroment_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroment] ADD CONSTRAINT [ChildEnviroment_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviromentActivity] ADD CONSTRAINT [ChildEnviromentActivity_childEnviromentId_fkey] FOREIGN KEY ([childEnviromentId]) REFERENCES [dbo].[ChildEnviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_hobbyId_fkey] FOREIGN KEY ([hobbyId]) REFERENCES [dbo].[Hobbies]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentTraits] ADD CONSTRAINT [EnviromentTraits_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnviromentTraits] ADD CONSTRAINT [EnviromentTraits_traitId_fkey] FOREIGN KEY ([traitId]) REFERENCES [dbo].[Traits]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TraitsAcquire] ADD CONSTRAINT [TraitsAcquire_childEnvActivityId_fkey] FOREIGN KEY ([childEnvActivityId]) REFERENCES [dbo].[ChildEnviromentActivity]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TraitsAcquire] ADD CONSTRAINT [TraitsAcquire_traitId_fkey] FOREIGN KEY ([traitId]) REFERENCES [dbo].[Traits]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildTraits] ADD CONSTRAINT [ChildTraits_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildTraits] ADD CONSTRAINT [ChildTraits_traitId_fkey] FOREIGN KEY ([traitId]) REFERENCES [dbo].[Traits]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FeedBack] ADD CONSTRAINT [FeedBack_careTakerId_fkey] FOREIGN KEY ([careTakerId]) REFERENCES [dbo].[CareTaker]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FeedBack] ADD CONSTRAINT [FeedBack_enviromentId_fkey] FOREIGN KEY ([enviromentId]) REFERENCES [dbo].[Enviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
