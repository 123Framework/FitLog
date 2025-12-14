using FitLog.Domain.Entities;
using FitLog.Infrastructure.Data;
using FitLog.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitLog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MealController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<User> _userManager;
        public MealController(AppDbContext db, UserManager<User> userManager)
        {
            _db = db;
            _userManager = userManager;




        }
        [HttpGet]
        public async Task<IActionResult> GetMeals()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var meals = await _db.Meals
                .Where(m => m.UserId == user.Id)
                .OrderByDescending(m => m.DateTime)
                .ToListAsync();
            return Ok(meals);
        }
        [HttpPost]
        public async Task<IActionResult> AddMeal([FromBody] MealDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var meal = new Meal
            {
                UserId = user.Id,
                DateTime = dto.DateTime == default ? DateTime.UtcNow : dto.DateTime,
                Name = dto.Name,
                Calories = dto.Calories,
                Protein = dto.Protein,
                Fat = dto.Fat,
                Carbs = dto.Carbs,



            };

            _db.Meals.Add(meal);
            await _db.SaveChangesAsync();
            return Ok(meal);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMeal(int id, [FromBody] MealDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var meal = await _db.Meals.FirstOrDefaultAsync(m => m.Id == id && m.UserId == user.Id);

            if (meal == null) return NotFound();
            meal.DateTime = dto.DateTime;
            meal.Name = dto.Name;
            meal.Calories = dto.Calories;
            meal.Protein = dto.Protein;
            meal.Fat = dto.Fat;
            meal.Carbs = dto.Carbs;
            await _db.SaveChangesAsync();
            return Ok(meal);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeal(int id)
        {
            var user = await _userManager.GetUserAsync (User);
            if (user == null) return Unauthorized();

            var meal = await _db.Meals
                .FirstOrDefaultAsync(m =>m.Id == id && m.UserId == user.Id);
            if (meal == null) return NotFound();
            _db.Meals.Remove(meal);
            await _db.SaveChangesAsync();
            return Ok(new { message = "MEal deleted"});
        }
    }


}
