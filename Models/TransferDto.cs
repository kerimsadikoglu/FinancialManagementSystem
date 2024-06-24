namespace FinancialManagementSystem.Models
{
	public class TransferDto
	{
		public int FromUserId { get; set; }
		public int ToUserId { get; set; }
		public decimal Amount { get; set; }
		public string CurrencyType { get; set; } = string.Empty;
		public DateTime Date { get; set; }
		public string Description { get; set; } = string.Empty;
	}
}
