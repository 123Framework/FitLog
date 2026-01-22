using FitLog.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitLog.Domain.Entities
{
    public class UserGoal
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;

        public double? TargetWeight { get; set; }
        public DateTime? TargetDate { get; set; }

        public int? DailyCalories { get; set; }
        public int? DailyProtein { get; set; }
        public int? DailyFat { get; set; }
        public int? DailyCarbs { get; set; }


        public AppUser? User { get; set; }
    }
}
