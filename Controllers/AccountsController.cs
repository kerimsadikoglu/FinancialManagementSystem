﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialManagementSystem.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace FinancialManagementSystem.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AccountsController : ControllerBase
	{
		private readonly FinancialContext _context;

		public AccountsController(FinancialContext context)
		{
			_context = context;
		}

		[HttpGet("user/{userId}")]
		public async Task<ActionResult<IEnumerable<AccountDto>>> GetAccountsByUser(int userId)
		{
			var accounts = await _context.Accounts
				.Where(a => a.UserId == userId)
				.Select(a => new AccountDto
				{
					AccountId = a.AccountId,
					UserId = a.UserId,
					Currency = a.Currency,
					Balance = a.Balance
				})
				.ToListAsync();

			if (accounts == null || !accounts.Any())
			{
				return NotFound();
			}

			return Ok(accounts);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteAccount(int id)
		{
			var account = await _context.Accounts.FindAsync(id);
			if (account == null)
			{
				return NotFound();
			}

			_context.Accounts.Remove(account);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpPost]
		public async Task<ActionResult<AccountDto>> PostAccount(AccountDto accountDto)
		{
			var user = await _context.Users.FindAsync(accountDto.UserId);
			if (user == null)
			{
				return BadRequest(new { message = "User not found" });
			}

			var account = new Account
			{
				Currency = accountDto.Currency,
				Balance = accountDto.Balance,
				UserId = accountDto.UserId
			};

			try
			{
				_context.Accounts.Add(account);
				await _context.SaveChangesAsync();

				accountDto.AccountId = account.AccountId; // Yeni eklenen account'ın ID'sini DTO'ya set ediyoruz
			}
			catch (Exception ex)
			{
				return BadRequest(new
				{
					message = "An error occurred while creating the account.",
					exceptionMessage = ex.Message,
					innerException = ex.InnerException?.Message,
					stackTrace = ex.StackTrace
				});
			}

			return CreatedAtAction(nameof(GetAccountsByUser), new { userId = account.UserId }, accountDto);
		}
	}
}
