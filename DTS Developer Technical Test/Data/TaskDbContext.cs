using DTS_Developer_Technical_Test.Models;
using Microsoft.EntityFrameworkCore;
using System.CodeDom;

namespace DTS_Developer_Technical_Test.Data
{
    public class TaskDbContext : DbContext
    {
        public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
        {

        }

        public DbSet<TaskDetails> Tasks { get; set; }
    }
}