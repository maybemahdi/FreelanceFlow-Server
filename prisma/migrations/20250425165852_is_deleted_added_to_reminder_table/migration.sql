-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "interactions" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "reminders" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
