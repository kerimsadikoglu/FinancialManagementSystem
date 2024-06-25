namespace FinancialManagementSystem.Models
{
	public class AccountDto
	{
		public int AccountId { get; set; }
		public string Currency { get; set; }
		public decimal Balance { get; set; }
		public int UserId { get; set; }
	}
}
