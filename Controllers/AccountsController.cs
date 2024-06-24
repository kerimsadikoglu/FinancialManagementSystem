using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialManagementSystem.Models;

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
	public async Task<ActionResult<IEnumerable<Account>>> GetAccountsByUser(int userId)
	{
		var accounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
		return Ok(accounts);
	}

	[HttpPost]
	public async Task<ActionResult<Account>> PostAccount(Account account)
	{
		var user = await _context.Users.FindAsync(account.UserId);
		if (user == null)
		{
			return BadRequest(new { message = "User not found" });
		}

		try
		{
			account.User = user; // User alanını set edin
			_context.Accounts.Add(account);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetAccountsByUser), new { userId = account.UserId }, account);
		}
		catch (Exception ex)
		{
			return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
		}
	}

	[HttpDelete("{accountId}")]
	public async Task<IActionResult> DeleteAccount(int accountId)
	{
		var account = await _context.Accounts.FindAsync(accountId);
		if (account == null)
		{
			return NotFound();
		}

		_context.Accounts.Remove(account);
		await _context.SaveChangesAsync();
		return NoContent();
	}
}
