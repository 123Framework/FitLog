using FitLog.Infrastructure.Data;
using FitLog.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace FitLog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class GoalController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public GoalController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;

        }

        [HttpGet]
        public async Task<IActionResult> GetGoal()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.UserId == user.Id);

            return Ok(new UserGoalDto
            {
                TargetWeight = goal.TargetWeight,
                TargetDate = goal.TargetDate,
                DailyCalories = goal.DailyCalories,
                DailyProtein = goal.DailyProtein,
                DailyCarbs = goal.DailyCarbs,
                DailyFat = goal.DailyFat,

            });
           
        }

        [HttpPost]
        public async Task<IActionResult> SetGoal([FromBody] UserGoalDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var goal = await _context.Goals.FirstOrDefaultAsync(g => g.UserId == user.Id);
            if (goal == null)
            {
                goal = new Domain.Entities.UserGoal { UserId = user.Id };
                _context.Goals.Add(goal);
                await _context.SaveChangesAsync();
            }
            goal.TargetWeight = dto.TargetWeight;
            goal.TargetDate = dto.TargetDate;
            goal.DailyCalories = dto.DailyCalories;
            goal.DailyProtein = dto.DailyProtein;
            goal.DailyFat = dto.DailyFat;
            goal.DailyCarbs = dto.DailyCarbs;

            await _context.SaveChangesAsync();

            return Ok(new UserGoalDto
            {
                TargetWeight = goal.TargetWeight,
                TargetDate = goal.TargetDate,
                DailyCalories = goal.DailyCalories,
                DailyProtein = goal.DailyProtein,
                DailyCarbs = goal.DailyCarbs,
                DailyFat = goal.DailyFat,

            });
        }
    }
}
