using System.ComponentModel.DataAnnotations;

namespace FinancialManagementSystem.Models
{
	public class TransactionDto
	{
		[Required]
		public int UserId { get; set; }

		[Required]
		[StringLength(100)]
		public string TransactionName { get; set; }

		[Required]
		[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
		public decimal Amount { get; set; }

		[Required]
		[StringLength(500)]
		public string Description { get; set; }
	}
}
