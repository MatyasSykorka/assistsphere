-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "phone_number" VARCHAR,
    "role_id" INTEGER DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "description" (
    "description_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "description_pkey" PRIMARY KEY ("description_id")
);

-- CreateTable
CREATE TABLE "floor" (
    "floor_id" SERIAL NOT NULL,
    "floor_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "floor_pkey" PRIMARY KEY ("floor_id")
);

-- CreateTable
CREATE TABLE "priority" (
    "priority_id" SERIAL NOT NULL,
    "priority_type" VARCHAR(255) NOT NULL,

    CONSTRAINT "priority_pkey" PRIMARY KEY ("priority_id")
);

-- CreateTable
CREATE TABLE "role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "room" (
    "room_id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_type" INTEGER NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "room_type" (
    "room_type_id" SERIAL NOT NULL,
    "room_type_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "room_type_pkey" PRIMARY KEY ("room_type_id")
);

-- CreateTable
CREATE TABLE "status" (
    "status_id" SERIAL NOT NULL,
    "status_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "ticket_id" SERIAL NOT NULL,
    "reported_user" TEXT NOT NULL,
    "ticket_title" VARCHAR(255) NOT NULL,
    "room" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "description" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "created_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_status" TIMESTAMP(6),
    "solved_at" TIMESTAMP(6),
    "ticket_attachment" INTEGER,
    "processing_user" TEXT,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "ticket_attachment" (
    "attachment_id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "uploaded_by" TEXT,

    CONSTRAINT "ticket_attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "priority_priority_type_key" ON "priority"("priority_type");

-- CreateIndex
CREATE UNIQUE INDEX "room_name_key" ON "room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "status_status_name_key" ON "status"("status_name");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_floor_fkey" FOREIGN KEY ("floor") REFERENCES "floor"("floor_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_room_type_fkey" FOREIGN KEY ("room_type") REFERENCES "room_type"("room_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_category_fkey" FOREIGN KEY ("category") REFERENCES "category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_description_fkey" FOREIGN KEY ("description") REFERENCES "description"("description_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_priority_fkey" FOREIGN KEY ("priority") REFERENCES "priority"("priority_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_reported_user_fkey" FOREIGN KEY ("reported_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_processing_user_fkey" FOREIGN KEY ("processing_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_room_fkey" FOREIGN KEY ("room") REFERENCES "room"("room_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_status_fkey" FOREIGN KEY ("status") REFERENCES "status"("status_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_ticket_attachment_fkey" FOREIGN KEY ("ticket_attachment") REFERENCES "ticket_attachment"("attachment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket_attachment" ADD CONSTRAINT "ticket_attachment_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
