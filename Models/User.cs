namespace FinancialManagementSystem.Models
{
	public class User
	{
		public int UserId { get; set; }
		public string Username { get; set; }
		public string Password { get; set; }
		public string Email { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public decimal TLBalance { get; set; } // TL bakiyesi
		public ICollection<Account> Accounts { get; set; } = new List<Account>();
	}
}