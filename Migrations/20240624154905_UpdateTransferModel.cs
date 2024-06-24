using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinancialManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTransferModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrencyType",
                table: "Transfer",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrencyType",
                table: "Transfer");
        }
    }
}
