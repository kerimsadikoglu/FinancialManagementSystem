﻿using FinancialManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancialManagementSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TransactionsController : ControllerBase
	{
		private readonly FinancialContext _context;

		public TransactionsController(FinancialContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
		{
			return await _context.Transactions.ToListAsync();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Transaction>> GetTransaction(int id)
		{
			var transaction = await _context.Transactions.FindAsync(id);

			if (transaction == null)
			{
				return NotFound();
			}

			return transaction;
		}

		[HttpPost]
		public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
		{
			_context.Transactions.Add(transaction);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, transaction);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
		{
			if (id != transaction.TransactionId)
			{
				return BadRequest();
			}

			_context.Entry(transaction).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!TransactionExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTransaction(int id)
		{
			var transaction = await _context.Transactions.FindAsync(id);
			if (transaction == null)
			{
				return NotFound();
			}

			_context.Transactions.Remove(transaction);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool TransactionExists(int id)
		{
			return _context.Transactions.Any(e => e.TransactionId == id);
		}
	}
}
