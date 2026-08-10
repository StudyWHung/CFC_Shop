using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CfcShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthAndSeedUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7009));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7021));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7024));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7027));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7029));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CreatedAt", "Email", "FullName", "PasswordHash", "RoleId" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@cfcshop.com", "System Administrator", "$2a$11$6l0WlL1Lj6WdPLWQZNmKVuRSOwO/2oCrh2N9WoRCHwgZm/8pXbp.a", 1 },
                    { 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "user@cfcshop.com", "Demo User", "$2a$11$rl3pnwg4HNC83GPsfymPkOK3jKK.rmCvNjdQEI.ywdijXseVDMTee", 2 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1273));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1282));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1285));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1287));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 9, 16, 11, 3, 400, DateTimeKind.Utc).AddTicks(1289));
        }
    }
}
