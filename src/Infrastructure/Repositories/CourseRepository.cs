using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Course>> GetAllAsync(string? search, CourseStatus? status, int page, int pageSize)
    {
        var query = _context.Courses.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => c.Title.Contains(search));
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        return await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(Guid id)
    {
        return await _context.Courses
            .Include(c => c.Lessons.OrderBy(l => l.Order))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddAsync(Course course)
    {
        await _context.Courses.AddAsync(course);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Course course)
    {
        course.UpdatedAt = DateTime.UtcNow;
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Course course)
    {
        course.IsDeleted = true;
        course.UpdatedAt = DateTime.UtcNow;
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }

    public async Task<int> CountAsync(string? search, CourseStatus? status)
    {
        var query = _context.Courses.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(c => c.Title.Contains(search));
        }

        if (status.HasValue)
        {
            query = query.Where(c => c.Status == status.Value);
        }

        return await query.CountAsync();
    }
}
