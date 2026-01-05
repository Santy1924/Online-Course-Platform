using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class LessonRepository : ILessonRepository
{
    private readonly ApplicationDbContext _context;

    public LessonRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Lesson>> GetByCourseIdAsync(Guid courseId)
    {
        return await _context.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .ToListAsync();
    }

    public async Task<Lesson?> GetByIdAsync(Guid id)
    {
        return await _context.Lessons.FindAsync(id);
    }

    public async Task AddAsync(Lesson lesson)
    {
        await _context.Lessons.AddAsync(lesson);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Lesson lesson)
    {
        lesson.UpdatedAt = DateTime.UtcNow;
        _context.Lessons.Update(lesson);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Lesson lesson)
    {
        lesson.IsDeleted = true;
        lesson.UpdatedAt = DateTime.UtcNow;
        _context.Lessons.Update(lesson);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsOrderUniqueAsync(Guid courseId, int order)
    {
        return !await _context.Lessons.AnyAsync(l => l.CourseId == courseId && l.Order == order);
    }

    public async Task<int> GetMaxOrderAsync(Guid courseId)
    {
        if (!await _context.Lessons.AnyAsync(l => l.CourseId == courseId))
        {
            return 0;
        }
        return await _context.Lessons.Where(l => l.CourseId == courseId).MaxAsync(l => l.Order);
    }
}
