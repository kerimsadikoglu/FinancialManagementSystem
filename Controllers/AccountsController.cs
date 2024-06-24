using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialManagementSystem.Models;
using System.Linq;
using System.Threading.Tasks;

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
		var accounts = await _context.Accounts
			.Where(a => a.UserId == userId)
			.ToListAsync();

		if (accounts == null || !accounts.Any())
		{
			return NotFound();
		}

		return Ok(accounts);
	}

	[HttpPost]
	public async Task<ActionResult<Account>> PostAccount(AccountDto accountDto)
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
		}
		catch (Exception ex)
		{
			return BadRequest(new { message = ex.Message, innerException = ex.InnerException?.Message, stackTrace = ex.StackTrace });
		}

		return CreatedAtAction(nameof(GetAccountsByUser), new { userId = account.UserId }, account);
	}
}
