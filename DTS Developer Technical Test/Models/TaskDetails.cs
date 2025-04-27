using System.ComponentModel.DataAnnotations;

namespace DTS_Developer_Technical_Test.Models
{
    public class TaskDetails
    {
      [Key]
      public required string PublicTaskID { get; set; }
      public required string Title { get; set; }
      public string? Description { get; set; }
      public required DateTime DueDateTime   { get; set; }

    }
}
