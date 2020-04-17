using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using AutoVideoMetaLocalize.Models;

namespace AutoVideoMetaLocalize.Database {
	public class ApplicationDbContext : DbContext {
		protected ApplicationDbContext() : base() { }
		public ApplicationDbContext(DbContextOptions options) : base(options) { }
	}
}
