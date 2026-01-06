using Application.DTOs;
using Domain.Enums;

namespace Application.Interfaces;

public interface ICourseService
{
    Task<IEnumerable<CourseDto>> GetAllAsync(string? search, CourseStatus? status, int page, int pageSize);
    Task<CourseDto?> GetByIdAsync(Guid id);
    Task<CourseDto> CreateAsync(CreateCourseDto dto);
    Task UpdateAsync(Guid id, UpdateCourseDto dto);
    Task DeleteAsync(Guid id);
    Task HardDeleteAsync(Guid id);
    Task PublishAsync(Guid id);
    Task UnpublishAsync(Guid id);
    Task<object> GetSummaryAsync(Guid id);
    Task<DashboardMetricsDto> GetDashboardMetricsAsync();
}
