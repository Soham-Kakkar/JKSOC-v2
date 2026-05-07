-- CreateEnum
CREATE TYPE "RepoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "github_id" BIGINT NOT NULL,
    "github_username" TEXT NOT NULL,
    "institute" TEXT,
    "institute_email" TEXT,
    "institute_verified" BOOLEAN NOT NULL DEFAULT false,
    "suspicion_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" SERIAL NOT NULL,
    "repo_url" TEXT NOT NULL,
    "status" "RepoStatus" NOT NULL,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributor_stats" (
    "user_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "pr_count" INTEGER NOT NULL DEFAULT 0,
    "issue_count" INTEGER NOT NULL DEFAULT 0,
    "first_pr_awarded" BOOLEAN NOT NULL DEFAULT false,
    "first_contribution_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributor_stats_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "maintainer_stats" (
    "user_id" INTEGER NOT NULL,
    "repos_count" INTEGER NOT NULL DEFAULT 0,
    "prs_merged_count" INTEGER NOT NULL DEFAULT 0,
    "issues_count" INTEGER NOT NULL DEFAULT 0,
    "contributors_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintainer_stats_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "user_id" INTEGER NOT NULL,
    "repo_id" INTEGER NOT NULL,
    "issue_number" INTEGER NOT NULL,
    "pr_id" BIGINT,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("user_id","repo_id","issue_number")
);

-- CreateTable
CREATE TABLE "processed_prs" (
    "pr_id" BIGINT NOT NULL,
    "repo_id" INTEGER NOT NULL,
    "issue_number" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_prs_pkey" PRIMARY KEY ("pr_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_institute_email_key" ON "users"("institute_email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_repo_url_key" ON "repositories"("repo_url");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributor_stats" ADD CONSTRAINT "contributor_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintainer_stats" ADD CONSTRAINT "maintainer_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_prs" ADD CONSTRAINT "processed_prs_repo_id_fkey" FOREIGN KEY ("repo_id") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processed_prs" ADD CONSTRAINT "processed_prs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
