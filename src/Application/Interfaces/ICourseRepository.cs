using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces;

public interface ICourseRepository
{
    Task<IEnumerable<Course>> GetAllAsync(string? search, CourseStatus? status, int page, int pageSize);
    Task<Course?> GetByIdAsync(Guid id);
    Task AddAsync(Course course);
    Task UpdateAsync(Course course);
    Task DeleteAsync(Course course); // Soft delete
    Task<int> CountAsync(string? search, CourseStatus? status);
}
