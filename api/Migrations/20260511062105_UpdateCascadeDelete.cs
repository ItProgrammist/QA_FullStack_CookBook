using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishImage_Dishes_DishId",
                table: "DishImage");

            migrationBuilder.DropForeignKey(
                name: "FK_DishIngredient_Dishes_DishId",
                table: "DishIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_DishIngredient_Products_ProductId",
                table: "DishIngredient");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductImage_Products_ProductId",
                table: "ProductImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductImage",
                table: "ProductImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishIngredient",
                table: "DishIngredient");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishImage",
                table: "DishImage");

            migrationBuilder.RenameTable(
                name: "ProductImage",
                newName: "ProductImages");

            migrationBuilder.RenameTable(
                name: "DishIngredient",
                newName: "DishIngredients");

            migrationBuilder.RenameTable(
                name: "DishImage",
                newName: "DishImages");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImage_ProductId",
                table: "ProductImages",
                newName: "IX_ProductImages_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_DishIngredient_ProductId",
                table: "DishIngredients",
                newName: "IX_DishIngredients_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_DishIngredient_DishId",
                table: "DishIngredients",
                newName: "IX_DishIngredients_DishId");

            migrationBuilder.RenameIndex(
                name: "IX_DishImage_DishId",
                table: "DishImages",
                newName: "IX_DishImages_DishId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductImages",
                table: "ProductImages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishIngredients",
                table: "DishIngredients",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishImages",
                table: "DishImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DishImages_Dishes_DishId",
                table: "DishImages",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishIngredients_Dishes_DishId",
                table: "DishIngredients",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishIngredients_Products_ProductId",
                table: "DishIngredients",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImages_Products_ProductId",
                table: "ProductImages",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishImages_Dishes_DishId",
                table: "DishImages");

            migrationBuilder.DropForeignKey(
                name: "FK_DishIngredients_Dishes_DishId",
                table: "DishIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_DishIngredients_Products_ProductId",
                table: "DishIngredients");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductImages_Products_ProductId",
                table: "ProductImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductImages",
                table: "ProductImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishIngredients",
                table: "DishIngredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DishImages",
                table: "DishImages");

            migrationBuilder.RenameTable(
                name: "ProductImages",
                newName: "ProductImage");

            migrationBuilder.RenameTable(
                name: "DishIngredients",
                newName: "DishIngredient");

            migrationBuilder.RenameTable(
                name: "DishImages",
                newName: "DishImage");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImage",
                newName: "IX_ProductImage_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_DishIngredients_ProductId",
                table: "DishIngredient",
                newName: "IX_DishIngredient_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_DishIngredients_DishId",
                table: "DishIngredient",
                newName: "IX_DishIngredient_DishId");

            migrationBuilder.RenameIndex(
                name: "IX_DishImages_DishId",
                table: "DishImage",
                newName: "IX_DishImage_DishId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductImage",
                table: "ProductImage",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishIngredient",
                table: "DishIngredient",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DishImage",
                table: "DishImage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DishImage_Dishes_DishId",
                table: "DishImage",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishIngredient_Dishes_DishId",
                table: "DishIngredient",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DishIngredient_Products_ProductId",
                table: "DishIngredient",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImage_Products_ProductId",
                table: "ProductImage",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
