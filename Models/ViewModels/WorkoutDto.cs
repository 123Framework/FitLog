using Microsoft.AspNetCore.Mvc;

namespace FitLog.Models.ViewModels
{
    public class WorkoutDto 
    {
        public string Title { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime DateTime {  get; set; }
        public int DurationMin {  get; set; }
        public double CaloriesBurned {  get; set; }
    }
}
