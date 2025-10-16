using FitLog.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace FitLog.Infrastructure.Data
{
    public class AppUser : IdentityUser<int>
    {
        public string DisplayName { get; set; } = string.Empty;
        public double HeightCm { get; set; }
        public double WeightKg { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Workout>? Workouts { get; set; }
        public ICollection<Meal>? Meals { get; set; }
    }
}