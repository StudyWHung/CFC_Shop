using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CfcShop.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductImagePaths : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 2, 32, 43, 885, DateTimeKind.Utc).AddTicks(4407), "/images/products/home-kit.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 2, 32, 43, 885, DateTimeKind.Utc).AddTicks(4419), "/images/products/away-kit.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 2, 32, 43, 885, DateTimeKind.Utc).AddTicks(4421), "/images/products/anthem-jacket.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 2, 32, 43, 885, DateTimeKind.Utc).AddTicks(4423), "/images/products/chelsea-scarf.jpg" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 2, 32, 43, 885, DateTimeKind.Utc).AddTicks(4426), "/images/products/crest-mug.jpg" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$WoKM53LIv/p6FnImj2OA4eK.csocfbVu2ZWWFb2yIvqEYd2oX4h6S");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$e2ypceZPF2Kd9XwaLCvfXu89EQMbgqRX0XM4A72BAWQwnClExhxYi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7009), "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7021), "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7024), "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7027), "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5,
                columns: new[] { "CreatedAt", "ImageUrl" },
                values: new object[] { new DateTime(2026, 8, 10, 1, 17, 16, 936, DateTimeKind.Utc).AddTicks(7029), "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$6l0WlL1Lj6WdPLWQZNmKVuRSOwO/2oCrh2N9WoRCHwgZm/8pXbp.a");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$rl3pnwg4HNC83GPsfymPkOK3jKK.rmCvNjdQEI.ywdijXseVDMTee");
        }
    }
}
