namespace FinancialManagementSystem.Models
{
	public class Transaction
	{
		public int TransactionId { get; set; }
		public int UserId { get; set; }
		public User User { get; set; }
		public decimal Amount { get; set; }
		public string Category { get; set; }
		public DateTime Date { get; set; }
		public string Description { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
	}
}