using DTS_Developer_Technical_Test.Data;
using DTS_Developer_Technical_Test.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace DTS_Developer_Technical_Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly TaskDbContext _dbContext;

        public TasksController(TaskDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<TaskDetails>> GetAllTasks()
        {
            var AllTaskks = await _dbContext.Tasks.ToListAsync();

            if (AllTaskks != null)
            {
                return Ok(AllTaskks);
            }
            else return NotFound();
        }


        [HttpGet("{PublicTaskID}")]
        public async Task<ActionResult<TaskDetails>> GetTaskByID(string PublicTaskID)
        {
            var Task = await _dbContext.Tasks.FindAsync(PublicTaskID);
            if (Task != null)
            {
                return Task;
            }
            else return NotFound();
        }


        //Error handling here is important 
        //Input error handling if primary key already exists. aka the case file 
        //Erorr and validations for data format, Should be some calendar for it so user don't have to input via text
        //Check for further errors
        [HttpPost]
        public async Task<ActionResult<TaskDetails>> AddTask(TaskDetails task)
        {
            var taskDetail = new TaskDetails()
            {
                PublicTaskID = task.PublicTaskID,
                Title = task.Title,
                Description = task.Description,
                DueDateTime = task.DueDateTime,

            };

            await _dbContext.AddAsync(taskDetail);
            await _dbContext.SaveChangesAsync();
            return Ok(taskDetail);

        }


        [HttpPut]
        public async Task<ActionResult<TaskDetails>> UpdateTaskDetails(TaskDetails updateTask)
        {
            var existingTask = await _dbContext.Tasks.FindAsync(updateTask.PublicTaskID);
            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Title = updateTask.Title;
            existingTask.Description = updateTask.Description;
            existingTask.DueDateTime = updateTask.DueDateTime;

            await _dbContext.SaveChangesAsync();

            return Ok(existingTask);
        }


        [HttpDelete("{PublicTaskID}")]
        public async Task<ActionResult<TaskDetails>> DeleteTask(string PublicTaskID)
        {
            var task = await _dbContext.Tasks.FindAsync(PublicTaskID);
            if (task == null)
                return NotFound();

            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}



