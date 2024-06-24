namespace FinancialManagementSystem.Models
{
	public class Transfer
	{
		public int TransferId { get; set; }
		public int FromUserId { get; set; }
		public User FromUser { get; set; } = null!;
		public int ToUserId { get; set; }
		public User ToUser { get; set; } = null!;
		public decimal Amount { get; set; }
		public DateTime Date { get; set; }
		public string Description { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
	}
}
