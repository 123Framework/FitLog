using FitLog.Domain.Entities;
using FitLog.Infrastructure.Data;
using FitLog.Models.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitLog.Controllers
{

    public class WeightController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly UserManager<User> _userManager;
        public WeightController(AppDbContext db, UserManager<User> userManager)
        {
            _db = db;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetWeights()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var weights = await _db.Weights
                .Where(w => w.UserId == user.Id)
                .OrderBy(w => w.Date)
                .ToListAsync();
            return Ok(weights);
        }
        [HttpPost]
        public async Task<IActionResult> AddWeight([FromBody] WeightDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var weight = new WeightEntry()
            {
                UserId = user.Id,
                WeightKg = dto.WeightKg,
                Date = dto.Date,


            };
            _db.Weights.Add(weight);
            await _db.SaveChangesAsync();
            return Ok(weight);
        }

    }
}
