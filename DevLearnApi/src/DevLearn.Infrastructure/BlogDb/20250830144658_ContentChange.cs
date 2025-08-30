using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLearn.Infrastructure.BlogDb
{
    /// <inheritdoc />
    public partial class ContentChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Content",
                schema: "dev",
                table: "articlecontents",
                type: "text",
                nullable: false,
                oldClrType: typeof(Dictionary<string, object>),
                oldType: "jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Dictionary<string, object>>(
                name: "Content",
                schema: "dev",
                table: "articlecontents",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
