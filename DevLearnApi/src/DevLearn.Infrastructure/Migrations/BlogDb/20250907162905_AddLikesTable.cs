using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLearn.Infrastructure.Migrations.BlogDb
{
    /// <inheritdoc />
    public partial class AddLikesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Likes",
                schema: "dev",
                table: "articles");

            migrationBuilder.CreateTable(
                name: "likes",
                schema: "dev",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EntityType = table.Column<int>(type: "integer", nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_likes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "likes",
                schema: "dev");

            migrationBuilder.AddColumn<int>(
                name: "Likes",
                schema: "dev",
                table: "articles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
