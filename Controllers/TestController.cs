﻿using FitLog.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace FitLog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TestController(AppDbContext context)
        {
            _context = context; 
        }
        [HttpGet("ping")]
        public ActionResult Ping() {
            return Ok("FitLog API работает");

        }
        [HttpGet("dbcheck")]
        public IActionResult DbCheck()
        {
            var canConnect = _context.Database.CanConnect();
            return Ok(new {Connected = canConnect});
        }

    }
}
