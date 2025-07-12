using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DevLearn.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dev");

            migrationBuilder.CreateTable(
                name: "applicationroles",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_applicationroles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "applicationusers",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    UserName = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_applicationusers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "aroleclaims",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_aroleclaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_aroleclaims_applicationroles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "dev",
                        principalTable: "applicationroles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "auserclaims",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "character varying(40)", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auserclaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_auserclaims_applicationusers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dev",
                        principalTable: "applicationusers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "auserlogins",
                schema: "dev",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "character varying(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auserlogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_auserlogins_applicationusers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dev",
                        principalTable: "applicationusers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "auserroles",
                schema: "dev",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "character varying(40)", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_auserroles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_auserroles_applicationroles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "dev",
                        principalTable: "applicationroles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_auserroles_applicationusers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dev",
                        principalTable: "applicationusers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ausertokens",
                schema: "dev",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "character varying(40)", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ausertokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_ausertokens_applicationusers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dev",
                        principalTable: "applicationusers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refreshtoken",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRevoked = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<string>(type: "character varying(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_refreshtoken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_refreshtoken_applicationusers_UserId",
                        column: x => x.UserId,
                        principalSchema: "dev",
                        principalTable: "applicationusers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "dev",
                table: "applicationroles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "dev",
                table: "applicationusers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "dev",
                table: "applicationusers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_aroleclaims_RoleId",
                schema: "dev",
                table: "aroleclaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_auserclaims_UserId",
                schema: "dev",
                table: "auserclaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_auserlogins_UserId",
                schema: "dev",
                table: "auserlogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_auserroles_RoleId",
                schema: "dev",
                table: "auserroles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_refreshtoken_UserId",
                schema: "dev",
                table: "refreshtoken",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "aroleclaims",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "auserclaims",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "auserlogins",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "auserroles",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "ausertokens",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "refreshtoken",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "applicationroles",
                schema: "dev");

            migrationBuilder.DropTable(
                name: "applicationusers",
                schema: "dev");
        }
    }
}
