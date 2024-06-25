namespace FinancialManagementSystem.Models
{
	public class BuySellDto
	{
		public int UserId { get; set; }
		public int AccountId { get; set; }
		public string Currency { get; set; }
		public decimal Amount { get; set; }
		public decimal Rate { get; set; }
	}
}
