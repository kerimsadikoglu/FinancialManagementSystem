namespace FinancialManagementSystem.Models
{
	public class Account
	{
		public int AccountId { get; set; }
		public int UserId { get; set; }
		public User? User { get; set; }
		public string Currency { get; set; }
		public decimal Balance { get; set; }
	}
}
