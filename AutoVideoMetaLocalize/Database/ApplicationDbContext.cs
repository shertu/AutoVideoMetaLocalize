using Microsoft.EntityFrameworkCore;

namespace AutoVideoMetaLocalize.Database {
	public class ApplicationDbContext : DbContext {
		protected ApplicationDbContext() : base() { }
		public ApplicationDbContext(DbContextOptions options) : base(options) { }
	}
}
