using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class ListOfImagesLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Url",
                table: "ProductImages",
                newName: "ContentType");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "DishImages",
                newName: "ContentType");

            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "ProductImages",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "DishImages",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "ProductImages");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "DishImages");

            migrationBuilder.RenameColumn(
                name: "ContentType",
                table: "ProductImages",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "ContentType",
                table: "DishImages",
                newName: "Url");
        }
    }
}
