﻿using FitLog.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FitLog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                DisplayName = dto.DisplayName,
                HeightCm = dto.HeightCm,
                WeightKg = dto.WeightKg,
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);

            }
            await _signInManager.SignInAsync(user, isPersistent: true);
            return Ok(new { Message = "Регистрация успешна" });

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, true, false);
            if (!result.Succeeded)
            {
                return Unauthorized("неверный логин или пароль");
            }

            return Ok(new { Message = "Вход выполнен" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { Message = "выход выполнен" });
        }


       
    }



    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public double HeightCm { get; set; }
        public double WeightKg { get; set; }

    }
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
