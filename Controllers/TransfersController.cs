using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialManagementSystem.Models;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class TransfersController : ControllerBase
{
	private readonly FinancialContext _context;

	public TransfersController(FinancialContext context)
	{
		_context = context;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Transfer>>> GetTransfers()
	{
		return await _context.Transfers.ToListAsync();
	}

	[HttpGet("user/{userId}")]
	public async Task<ActionResult<IEnumerable<Transfer>>> GetTransfersByUser(int userId)
	{
		var transfers = await _context.Transfers
			.Where(t => t.FromUserId == userId || t.ToUserId == userId)
			.Include(t => t.FromUser)
			.Include(t => t.ToUser)
			.ToListAsync();

		return Ok(transfers);
	}

	


	[HttpPost]
	public async Task<ActionResult<Transfer>> PostTransfer(TransferDto transferDto)
	{
		var fromUser = await _context.Users.FindAsync(transferDto.FromUserId);
		var toUser = await _context.Users.FindAsync(transferDto.ToUserId);

		if (fromUser == null || toUser == null)
		{
			return BadRequest(new { message = "Users not found" });
		}

		if (fromUser.TLBalance < transferDto.Amount)
		{
			return BadRequest(new { message = "Insufficient TL balance" });
		}

		// TL bakiyelerini güncelleme
		fromUser.TLBalance -= transferDto.Amount;
		toUser.TLBalance += transferDto.Amount;

		var transfer = new Transfer
		{
			FromUserId = transferDto.FromUserId,
			ToUserId = transferDto.ToUserId,
			Amount = transferDto.Amount,
			CurrencyType = transferDto.CurrencyType,
			Date = transferDto.Date,
			Description = transferDto.Description,
			CreatedAt = DateTime.UtcNow,
			UpdatedAt = DateTime.UtcNow
		};

		_context.Transfers.Add(transfer);
		await _context.SaveChangesAsync();

		return CreatedAtAction(nameof(GetTransfersByUser), new { userId = transfer.FromUserId }, transfer);
	}
}
