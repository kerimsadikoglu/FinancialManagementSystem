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

		[HttpPost]
		public async Task<ActionResult<Transfer>> PostTransfer(Transfer transfer)
		{
			_context.Transfers.Add(transfer);
			await _context.SaveChangesAsync();

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
