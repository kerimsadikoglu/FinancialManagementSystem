using Microsoft.EntityFrameworkCore;

namespace FinancialManagementSystem.Models
{
	public class FinancialContext : DbContext
	{
		public FinancialContext(DbContextOptions<FinancialContext> options) : base(options) { }

		public DbSet<User> Users { get; set; }
		public DbSet<Transaction> Transactions { get; set; }
		public DbSet<Transfer> Transfers { get; set; }
		public DbSet<Account> Accounts { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<User>().ToTable("User");
			modelBuilder.Entity<Transaction>().ToTable("Transaction");
			modelBuilder.Entity<Transfer>().ToTable("Transfer");
			modelBuilder.Entity<Account>().ToTable("Account");

			modelBuilder.Entity<Transaction>()
				.Property(t => t.Amount)
				.HasColumnType("decimal(18,2)");

			modelBuilder.Entity<Transfer>()
				.Property(t => t.Amount)
				.HasColumnType("decimal(18,2)");

			modelBuilder.Entity<Transfer>()
				.HasOne(t => t.FromUser)
				.WithMany()
				.HasForeignKey(t => t.FromUserId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<Transfer>()
				.HasOne(t => t.ToUser)
				.WithMany()
				.HasForeignKey(t => t.ToUserId)
				.OnDelete(DeleteBehavior.NoAction);

			modelBuilder.Entity<Account>()
				.HasOne(a => a.User)
				.WithMany(u => u.Accounts)
				.HasForeignKey(a => a.UserId);
		}
	}
}
