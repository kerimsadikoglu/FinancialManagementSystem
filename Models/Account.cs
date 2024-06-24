namespace FinancialManagementSystem.Models
{
	public class Account
	{
		public int AccountId { get; set; }
		public string Name { get; set; }
		public string Currency { get; set; }
		public int UserId { get; set; }
		public User? User { get; set; } // User ilişkisini null kabul edilebilir yapın
	}
}
