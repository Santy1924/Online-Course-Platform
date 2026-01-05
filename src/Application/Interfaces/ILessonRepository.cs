using Domain.Entities;

namespace Application.Interfaces;

public interface ILessonRepository
{
    Task<IEnumerable<Lesson>> GetByCourseIdAsync(Guid courseId);
    Task<Lesson?> GetByIdAsync(Guid id);
    Task AddAsync(Lesson lesson);
    Task UpdateAsync(Lesson lesson);
    Task DeleteAsync(Lesson lesson); // Soft delete
    Task<bool> IsOrderUniqueAsync(Guid courseId, int order);
    Task<int> GetMaxOrderAsync(Guid courseId);
}
