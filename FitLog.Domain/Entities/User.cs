using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitLog.Domain.Entities
{
    public class User
    {
        public int Id {  get; set; }
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public double HeightCm  { get; set; }
        public double WeightKg { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
