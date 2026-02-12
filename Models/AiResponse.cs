namespace FitLog.Models
{
    public class AiResponse
    {

        public List<AIChoice> Choices { get; set; }


    }
    public class AIChoice
    {
        public AIMessage Message { get; set; }
    }
    public class AIMessage { 
    
    
    public string Role{ get; set; }
    public string Content{ get; set; }

    
    }
}
