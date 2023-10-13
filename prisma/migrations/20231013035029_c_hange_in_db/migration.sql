BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ChildEnviromentActivity] DROP CONSTRAINT [ChildEnviromentActivity_childEnviromentId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviroment] ADD CONSTRAINT [ChildEnviroment_childId_fkey] FOREIGN KEY ([childId]) REFERENCES [dbo].[Children]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChildEnviromentActivity] ADD CONSTRAINT [ChildEnviromentActivity_childEnviromentId_fkey] FOREIGN KEY ([childEnviromentId]) REFERENCES [dbo].[ChildEnviroment]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
