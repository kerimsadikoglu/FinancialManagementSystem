namespace FinancialManagementSystem.Models
{
	public class AccountDto
	{
		public string Name { get; set; }
		public string Currency { get; set; }
		public decimal Balance { get; set; }
		public int UserId { get; set; }
	}
}
