namespace FitLog.Models.ViewModels
{
    public class UserGoalDto
    {
        public double? TargetWeight { get; set; }
        public DateTime? TargetDate { get; set; }

        public int? DailyCalories { get; set; }
        public int? DailyProtein { get; set; }
        public int? DailyFat { get; set; }
        public int? DailyCarbs { get; set; }


    }
}
