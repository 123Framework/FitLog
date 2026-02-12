using Microsoft.AspNetCore.Mvc;

namespace FitLog.Models
{
    public class AiRequest { 
    public string Model { get; set; }
        public List<MessageDto> Messages { get; set; }
    
    }
        
    public class MessageDto
    {
        public string Role { get; set; }
        public string Content { get; set; }


    }



}
