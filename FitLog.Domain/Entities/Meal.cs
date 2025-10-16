namespace FitLog.Domain.Entities
{
    public class Meal
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public DateTime DateTime { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Calories { get; set; } 
        public double Protein{ get; set; } 
        public double Fat { get; set; } 
        public double Carbs { get; set; } 

        //nav
        public User? User { get; set; }

    }
}