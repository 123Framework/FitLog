using FitLog.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitLog.Infrastructure.Data
{
    public class AppDbContext  : IdentityDbContext<AppUser, AppRole, string>

    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
       
        public DbSet<Workout> Workouts => Set<Workout>();
        public DbSet<Meal> Meals => Set<Meal>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(u => u.Email)
                .IsUnique();
            });
            /*modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(u => u.Email).IsUnique();
            });*/
            modelBuilder.Entity<Workout>(entity =>
            {
                entity.HasKey(w => w.Id);
                entity.Property(w => w.Title).HasMaxLength(100);
                entity.HasOne(w => w.User)
                .WithMany(u => u.Workouts)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            });
            
            modelBuilder.Entity<Meal>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name).HasMaxLength(100);
                entity.HasOne(m => m.User)
                .WithMany(u => u.Meals)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            });
            

        }
    }
}
