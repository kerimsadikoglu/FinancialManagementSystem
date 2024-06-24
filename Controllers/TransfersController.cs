using FinancialManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinancialManagementSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
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

		[HttpGet("{id}")]
		public async Task<ActionResult<Transfer>> GetTransfer(int id)
		{
			var transfer = await _context.Transfers.FindAsync(id);

			if (transfer == null)
			{
				return NotFound();
			}

			return transfer;
		}

		[HttpGet("user/{userId}")]
		public async Task<ActionResult<IEnumerable<Transfer>>> GetTransfersByUser(int userId)
		{
			var transfers = await _context.Transfers
				.Include(t => t.FromUser)
				.Include(t => t.ToUser)
				.Where(t => t.FromUserId == userId || t.ToUserId == userId)
				.ToListAsync();

			return Ok(transfers);
		}


		[HttpPost]
		public async Task<ActionResult<Transfer>> PostTransfer(Transfer transfer)
		{
			transfer.CreatedAt = DateTime.UtcNow;
			transfer.UpdatedAt = DateTime.UtcNow;

			if (transfer.FromUserId == 0 || transfer.ToUserId == 0)
			{
				return BadRequest(new { message = "FromUserId and ToUserId cannot be zero." });
			}

			try
			{
				_context.Transfers.Add(transfer);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
			}

			return CreatedAtAction(nameof(GetTransfer), new { id = transfer.TransferId }, transfer);
		}




		[HttpPut("{id}")]
		public async Task<IActionResult> PutTransfer(int id, Transfer transfer)
		{
			if (id != transfer.TransferId)
			{
				return BadRequest();
			}

			_context.Entry(transfer).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!TransferExists(id))
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
		public async Task<IActionResult> DeleteTransfer(int id)
		{
			var transfer = await _context.Transfers.FindAsync(id);
			if (transfer == null)
			{
				return NotFound();
			}

			_context.Transfers.Remove(transfer);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool TransferExists(int id)
		{
			return _context.Transfers.Any(e => e.TransferId == id);
		}
	}
}
