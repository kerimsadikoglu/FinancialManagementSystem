﻿using System;
using System.ComponentModel.DataAnnotations;

namespace FinancialManagementSystem.Models
{
	public class Transaction
	{
		public int TransactionId { get; set; }

		[Required]
		public int UserId { get; set; }

		[Required]
		public User User { get; set; }

		[Required]
		[StringLength(100)]
		public string TransactionName { get; set; }

		[Required]
		[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
		public decimal Amount { get; set; }

		[Required]
		[StringLength(500)]
		public string Description { get; set; }

		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
	}
}
