namespace FitLog.Domain.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Notes { get; set; }

        public int DurationMin { get; set; }

        public double CaloriesBurned { get; set; }

        //nav
        public User? User { get; set; }
    }
}