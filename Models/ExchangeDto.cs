namespace FinancialManagementSystem.Models
{
	public class ExchangeDto
	{
		public int UserId { get; set; }
		public int AccountId { get; set; }
		public decimal Amount { get; set; }
		public string Type { get; set; }
		public decimal ExchangeRate { get; set; }
	}
}
