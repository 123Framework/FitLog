using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitLog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class In5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Goals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TargetWeight = table.Column<double>(type: "float", nullable: true),
                    TargetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DailyCalories = table.Column<int>(type: "int", nullable: true),
                    DailyProtein = table.Column<int>(type: "int", nullable: true),
                    DailyFat = table.Column<int>(type: "int", nullable: true),
                    DailyCarbs = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Goals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Goals_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Goals_UserId",
                table: "Goals",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Goals");
        }
    }
}
