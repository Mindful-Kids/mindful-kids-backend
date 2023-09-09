/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Student];

-- CreateTable
CREATE TABLE [dbo].[Admin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    CONSTRAINT [Admin_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CareTaker] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [gender] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    CONSTRAINT [CareTaker_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnvironment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [child_id] INT NOT NULL,
    [env_id] INT NOT NULL,
    CONSTRAINT [ChildEnvironment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildEnvironmentActivity] (
    [id] INT NOT NULL IDENTITY(1,1),
    [child_env_id] INT NOT NULL,
    [activity_time_start] DATETIME2 NOT NULL,
    [activity_time_end] DATETIME2 NOT NULL,
    CONSTRAINT [ChildEnvironmentActivity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ChildHobby] (
    [id] INT NOT NULL IDENTITY(1,1),
    [child_id] INT NOT NULL,
    [hobby_id] INT NOT NULL,
    CONSTRAINT [ChildHobby_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Child] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date_of_birth] DATETIME2 NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [gender] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    [parent] INT NOT NULL,
    CONSTRAINT [Child_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Environment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [gender] NVARCHAR(1000) NOT NULL,
    [start_age] INT NOT NULL,
    [end_age] INT NOT NULL,
    [path] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    [added_by] INT NOT NULL,
    CONSTRAINT [Environment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EnvironmentHobbies] (
    [id] INT NOT NULL IDENTITY(1,1),
    [env_id] INT NOT NULL,
    [hobby_id] INT NOT NULL,
    CONSTRAINT [EnvironmentHobbies_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Hobby] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000),
    CONSTRAINT [Hobby_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Traits] (
    [id] INT NOT NULL IDENTITY(1,1),
    [learning] FLOAT(53),
    [confidence] FLOAT(53),
    [public_speaking] FLOAT(53),
    [communication_skills] FLOAT(53),
    [sympathy] FLOAT(53),
    [honesty] FLOAT(53),
    [responsibility] FLOAT(53),
    [activity_id] INT,
    CONSTRAINT [Traits_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnvironment] ADD CONSTRAINT [ChildEnvironment_child_id_fkey] FOREIGN KEY ([child_id]) REFERENCES [dbo].[Child]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnvironment] ADD CONSTRAINT [ChildEnvironment_env_id_fkey] FOREIGN KEY ([env_id]) REFERENCES [dbo].[Environment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnvironmentActivity] ADD CONSTRAINT [ChildEnvironmentActivity_child_env_id_fkey] FOREIGN KEY ([child_env_id]) REFERENCES [dbo].[ChildEnvironment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_child_id_fkey] FOREIGN KEY ([child_id]) REFERENCES [dbo].[Child]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildHobby] ADD CONSTRAINT [ChildHobby_hobby_id_fkey] FOREIGN KEY ([hobby_id]) REFERENCES [dbo].[Hobby]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Child] ADD CONSTRAINT [Child_parent_fkey] FOREIGN KEY ([parent]) REFERENCES [dbo].[CareTaker]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Environment] ADD CONSTRAINT [Environment_added_by_fkey] FOREIGN KEY ([added_by]) REFERENCES [dbo].[Admin]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnvironmentHobbies] ADD CONSTRAINT [EnvironmentHobbies_env_id_fkey] FOREIGN KEY ([env_id]) REFERENCES [dbo].[Environment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[EnvironmentHobbies] ADD CONSTRAINT [EnvironmentHobbies_hobby_id_fkey] FOREIGN KEY ([hobby_id]) REFERENCES [dbo].[Hobby]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Traits] ADD CONSTRAINT [Traits_activity_id_fkey] FOREIGN KEY ([activity_id]) REFERENCES [dbo].[ChildEnvironmentActivity]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
