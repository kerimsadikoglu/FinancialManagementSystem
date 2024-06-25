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
	public class UsersController : ControllerBase
	{
		private readonly FinancialContext _context;

		public UsersController(FinancialContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<User>>> GetUsers()
		{
			return await _context.Users.ToListAsync();
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginModel login)
		{
			var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == login.Email && u.Password == login.Password);
			if (user == null)
			{
				return Unauthorized(new { message = "Invalid credentials" });
			}

			return Ok(new { userId = user.UserId, username = user.Username });
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<User>> GetUser(int id)
		{
			var user = await _context.Users.FindAsync(id);

			if (user == null)
			{
				return NotFound();
			}

			return user;
		}

		[HttpPost]
		public async Task<ActionResult<User>> PostUser(User user)
		{
			user.TLBalance = 0;
			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> PutUser(int id, [FromBody] UserDto userDto)
		{
			if (id != userDto.UserId)
			{
				return BadRequest("User ID mismatch.");
			}

			var user = await _context.Users.FindAsync(id);
			if (user == null)
			{
				return NotFound();
			}

			user.Username = userDto.Username;
			user.Email = userDto.Email;
			user.Password = userDto.Password;

			_context.Entry(user).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!UserExists(id))
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
		public async Task<IActionResult> DeleteUser(int id)
		{
			var user = await _context.Users.FindAsync(id);
			if (user == null)
			{
				return NotFound();
			}

			_context.Users.Remove(user);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool UserExists(int id)
		{
			return _context.Users.Any(e => e.UserId == id);
		}

		public class LoginModel
		{
			public string Email { get; set; }
			public string Password { get; set; }
		}
	}
}
