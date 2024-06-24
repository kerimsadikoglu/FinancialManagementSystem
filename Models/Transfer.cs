namespace FinancialManagementSystem.Models
{
    public class Transfer
    {
        public int TransferId { get; set; }
        public int FromUserId { get; set; }
        public User FromUser { get; set; }
        public int ToUserId { get; set; }
        public User ToUser { get; set; }
        public int FromAccountId { get; set; }
        public Account FromAccount { get; set; }
        public int ToAccountId { get; set; }
        public Account ToAccount { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string CurrencyType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
