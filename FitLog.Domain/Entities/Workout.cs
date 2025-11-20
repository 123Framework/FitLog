using FitLog.Infrastructure.Data;

namespace FitLog.Domain.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;



        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Notes { get; set; }

        public int DurationMin { get; set; }

        public double CaloriesBurned { get; set; }

        //nav
        public AppUser User { get; set; } = null!;

    }
}
