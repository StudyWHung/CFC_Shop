using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CfcShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCodesAndDescriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Products",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductCode",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrderCode",
                table: "Orders",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Description", "ProductCode" },
                values: new object[] { new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1273), "Official Chelsea FC 2024/25 Home Jersey featuring breathable Dri-FIT technology.", "KIT-CFC-001" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Description", "ProductCode" },
                values: new object[] { new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1282), "Official Chelsea FC 2024/25 Away Jersey with modern design and premium fabric.", "KIT-CFC-002" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Description", "ProductCode" },
                values: new object[] { new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1285), "Comfortable Chelsea FC Anthem Track Jacket for training and casual wear.", "TRN-CFC-001" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Description", "ProductCode" },
                values: new object[] { new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1287), "Classic blue and white knitted Chelsea FC fan scarf.", "ACC-CFC-001" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Description", "ProductCode" },
                values: new object[] { new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1289), "High quality ceramic mug with official Chelsea FC crest.", "SOU-CFC-001" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCode",
                table: "Products",
                column: "ProductCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderCode",
                table: "Orders",
                column: "OrderCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Products_ProductCode",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Orders_OrderCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductCode",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OrderCode",
                table: "Orders");
        }
    }
}
