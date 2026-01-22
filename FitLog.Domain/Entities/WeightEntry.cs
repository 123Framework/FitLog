using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitLog.Domain.Entities
{
     public class WeightEntry
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public double WeightKg { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }


    }
}
