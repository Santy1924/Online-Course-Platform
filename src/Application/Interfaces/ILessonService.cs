using Application.DTOs;

namespace Application.Interfaces;

public interface ILessonService
{
    Task<IEnumerable<LessonDto>> GetByCourseIdAsync(Guid courseId);
    Task<LessonDto?> GetByIdAsync(Guid id);
    Task<LessonDto> CreateAsync(CreateLessonDto dto);
    Task UpdateAsync(Guid id, UpdateLessonDto dto);
    Task DeleteAsync(Guid id);
    Task HardDeleteAsync(Guid id);
    Task ReorderAsync(Guid courseId, List<Guid> newOrder);
}
