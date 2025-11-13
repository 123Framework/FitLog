using Microsoft.AspNetCore.Mvc;

namespace FitLog.Controllers
{
    public class WorkoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
